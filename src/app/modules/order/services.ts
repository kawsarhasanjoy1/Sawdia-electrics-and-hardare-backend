import { StatusCodes } from "http-status-codes";
import AppError from "../../error/handleAppError";
import { ProductModel } from "../product/model";
import { TOrder } from "./interface";
import { OrderModel } from "./model";
import { UserModel } from "../user/model";

const createOrder = async (payload: Partial<TOrder>) => {
    if (!payload?.products || payload.products.length === 0) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Products are required");
    }

    let totalAmount = 0;
    console.log(totalAmount)

    for (const item of payload.products) {
        const product = await ProductModel.findById(item.productId);

        if (!product) throw new AppError(StatusCodes.NOT_FOUND, "Product not found");


        if (product.stock < item.quantity) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                `${product.name} has only ${product.stock} items left`
            );
        }
        const price = product.discountPrice ? product.discountPrice : product.price;
        totalAmount += price * item.quantity;

        const result = await ProductModel.updateOne(
            { _id: item.productId, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } }
        );
        if (result.modifiedCount === 0) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                `${product.name} does not have enough stock`
            );
        }
    }


    const order = await OrderModel.create({
        ...payload,
        totalPrice: totalAmount,

    });

    return order;
};

const getAllOrders = async () => {
    const result = await OrderModel.find().populate("userId").populate("products.productId");
    return result
};

const getOrderById = async (id: string) => {
    return await OrderModel.findById(id)
        .populate("userId")
        .populate("products.productId");
};
const getOrderByUser = async (id: string) => {
    console.log(id)
    const user = await UserModel.findById(id);
    await UserModel.isUserExistsByEmail(user?.email as string)
    return await OrderModel.find({ userId: id })
        .populate("userId")
        .populate("products.productId");
};

const updateOrderStatus = async (id: string, status: string) => {
    return await OrderModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
};

const deleteOrder = async (id: string) => {
    return await OrderModel.findByIdAndDelete(id);
}

export const OrderService = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getOrderByUser
};
