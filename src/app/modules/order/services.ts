// import { StatusCodes } from "http-status-codes";
// import AppError from "../../error/handleAppError";
// import { ProductModel } from "../product/model";
// import { UserModel } from "../user/model";
// import { OrderModel } from "../payment/model";
// import { TOrder } from "../payment/interface";

// // const createOrder = async (payload: Partial<TOrder>) => {
 
// //     return null
// // };

// const getAllOrders = async () => {
//     const result = await OrderModel.find().populate("userId").populate("products.productId");
//     return result
// };

// const getOrderById = async (id: string) => {
//     return await OrderModel.findById(id)
//         .populate("userId")
//         .populate("products.productId");
// };
// const getOrderByUser = async (id: string) => {
//     console.log(id)
//     const user = await UserModel.findById(id);
//     await UserModel.isUserExistsByEmail(user?.email as string)
//     return await OrderModel.find({ userId: id })
//         .populate("userId")
//         .populate("products.productId");
// };

// const updateOrderStatus = async (id: string, status: string) => {
//     return await OrderModel.findByIdAndUpdate(
//         id,
//         { status },
//         { new: true }
//     );
// };

// const deleteOrder = async (id: string) => {
//     return await OrderModel.findByIdAndDelete(id);
// }

// export const OrderService = {
//     // createOrder,
//     getAllOrders,
//     getOrderById,
//     updateOrderStatus,
//     deleteOrder,
//     getOrderByUser
// };
