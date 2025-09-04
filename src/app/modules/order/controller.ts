// import { Request, Response } from "express";
// import { catchAsync } from "../../utils/catchAsync";
// import { OrderService } from "./services";
// import sendResponse from "../../utils/sendResponse";
// import { StatusCodes } from "http-status-codes";


// // // Create Order
// // const createOrderController = catchAsync(async (req: Request, res: Response) => {
// //   const order = await OrderService.createOrder(req.body);
// //   sendResponse(res, {
// //     statusCode: StatusCodes.CREATED,
// //     success: true,
// //     message: "Order created successfully",
// //     data: order,
// //   });
// // });

// // Get All Orders
// const getAllOrdersController = catchAsync(async (req: Request, res: Response) => {
//   const orders = await OrderService.getAllOrders();
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Orders retrieved successfully",
//     data: orders,
//   });
// });

// // Get Single Order
// const getOrderByIdController = catchAsync(async (req: Request, res: Response) => {
//   const order = await OrderService.getOrderById(req.params.id);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Order retrieved successfully",
//     data: order,
//   });
// });
// const getOrderByUserIdController = catchAsync(async (req: Request, res: Response) => {
//     console.log(req.params.userId)
//   const order = await OrderService.getOrderByUser(req.params.userId);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Order retrieved successfully",
//     data: order,
//   });
// });

// // Update Order Status
// const updateOrderStatusController = catchAsync(async (req: Request, res: Response) => {
//   const order = await OrderService.updateOrderStatus(req.params.id, req.body.status);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Order status updated successfully",
//     data: order,
//   });
// });

// // Delete Order
// const deleteOrderController = catchAsync(async (req: Request, res: Response) => {
//   const result = await OrderService.deleteOrder(req.params.id);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Order deleted successfully",
//     data: result,
//   });
// });

// export const orderController = {
// //   createOrderController,
//   getAllOrdersController,
//   getOrderByIdController,
//   updateOrderStatusController,
//   deleteOrderController,
//   getOrderByUserIdController
// };
