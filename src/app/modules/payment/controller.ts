import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import config from "../../config/config";
import { paymentServices } from "./services";
import { UserModel } from "../user/model";
import { ProductModel } from "../product/model";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { OrderModel } from "./model";
import AppError from "../../error/handleAppError";
import sendResponse from "../../utils/sendResponse";
const is_live = false
const tran_id = new ObjectId().toString()
const SSLCommerzPayment = require('sslcommerz-lts')

const createPaymenController = catchAsync(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ _id: req.body.userId });
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

    let totalAmount = 0;

    for (const item of req.body.products) {
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


    }

    const finalPaymentOrder = {
        name: user.name,
        email: user.email,
        price: totalAmount,
        address: req.body.shippingAddress,
        tran_id: tran_id
    };

    // payment service create
    const result = await paymentServices.createPayment(finalPaymentOrder);
    const sslcz = new SSLCommerzPayment(config.store_id, config.store_pass, is_live);
    sslcz.init(result).then(async (apiResponse: { GatewayPageURL: string }) => {

        const order = await OrderModel.create({
            ...req.body,
            totalAmount,
            tran_id: tran_id,

        });

        if (order?.products && Array.isArray(order.products)) {
            for (let item of order.products) {
                const product = await ProductModel.findById(item?.productId);
                if (product) {
                    await ProductModel.updateOne(
                        { _id: product._id },
                        { $inc: { stock: -item.quantity } }
                    );
                }
            }
        }


        res.json({
            url: apiResponse.GatewayPageURL
        });
    });
});

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
    const { transectionId } = req.params;

    const order = await OrderModel.findOneAndUpdate(
        { tran_id: transectionId },
        { status: "paid", paymentStatus: "success" },
        { new: true }
    )
        .populate("products.productId", "name price stock images")
        .populate("userId", "name email");

    if (!order) throw new AppError(StatusCodes.NOT_FOUND, "Order not found");

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Payment successful",
        data: order,
    });
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
    const { transectionId } = req.params;

    // Find the order first
    const order = await OrderModel.findOne({ tran_id: transectionId });

    if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Order not found",
        });
    }

    if (order.products && Array.isArray(order.products)) {
        for (const item of order.products) {
            await ProductModel.updateOne(
                { _id: item.productId },
                { $inc: { stock: item.quantity } }
            );
        }
    }


    await OrderModel.deleteOne({ tran_id: transectionId });

    res.status(StatusCodes.OK).json({
        success: false,
        message: "Payment failed. Order cancelled and stock restored.",
    });
});



const paymentCancel = catchAsync(async (req: Request, res: Response) => {
    const { transectionId } = req.params;

    // Find the order first
    const order = await OrderModel.findOne({ tran_id: transectionId });
    if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Order not found",
        });
    }

    // Restore stock
    if (order.products && Array.isArray(order.products)) {
        await Promise.all(order.products.map(item =>
            ProductModel.updateOne(
                { _id: item.productId },
                { $inc: { stock: item.quantity } }
            )
        ));
    }

    // Update order status
    const updatedOrder = await OrderModel.findOneAndUpdate(
        { tran_id: transectionId },
        { status: "cancelled", paymentStatus: "failed" },
        { new: true }
    );

    res.status(StatusCodes.OK).json({
        success: false,
        message: "Payment cancelled by user",
        data: updatedOrder,
    });
});


const getPayments = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await paymentServices.getPayments(query);
    sendResponse(res, {
        statusCode: 200,
        message: "payment faced successful",
        data: result,
        success: false
    });
});
const getUserPayments = catchAsync(async (req: Request, res: Response) => {
    const id = req?.params?.userId;
    const query = req?.query;
    const result = await paymentServices.getUserPayments({ id, query });
    sendResponse(res, {
        statusCode: 200,
        message: "payment faced successful",
        data: result,
        success: false
    });
});



export const paymentController = {
    createPaymenController,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    getPayments,
    getUserPayments
}



// if (!payload?.products || payload.products.length === 0) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "Products are required");
// }

// let totalAmount = 0;

// for (const item of payload.products) {
//     const product = await ProductModel.findById(item.productId);

//     if (!product) throw new AppError(StatusCodes.NOT_FOUND, "Product not found");


//     if (product.stock < item.quantity) {
//         throw new AppError(
//             StatusCodes.BAD_REQUEST,
//             `${product.name} has only ${product.stock} items left`
//         );
//     }
//     const price = product.discountPrice ? product.discountPrice : product.price;
//     totalAmount += price * item.quantity;

//     const result = await ProductModel.updateOne(
//         { _id: item.productId, stock: { $gte: item.quantity } },
//         { $inc: { stock: -item.quantity } }
//     );
//     if (result.modifiedCount === 0) {
//         throw new AppError(
//             StatusCodes.BAD_REQUEST,
//             `${product.name} does not have enough stock`
//         );
//     }
// }


// const order = await OrderModel.create({
//     ...payload,
//     totalPrice: totalAmount,

// });
