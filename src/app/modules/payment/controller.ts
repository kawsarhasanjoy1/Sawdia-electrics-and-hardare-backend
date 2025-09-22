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
import { couponServices } from "../coupon/services";

const is_live = false;
const SSLCommerzPayment = require("sslcommerz-lts");

const createPaymenController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    if (
      !req.body.products ||
      !Array.isArray(req.body.products) ||
      req.body.products.length === 0
    ) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Products are required");
    }
    let totalAmount = 0;
    let discount = 0;
    for (const item of req.body.products) {
      const product = await ProductModel.findById(item.productId);
      if (!product)
        throw new AppError(
          StatusCodes.NOT_FOUND,
          `Product not found: ${item.productId}`
        );
      if (product.stock < item.quantity)
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `${product.name} has only ${product.stock} items left`
        );
      totalAmount = item?.price;
    }

    const tran_id = new ObjectId().toString();
    if (req?.body?.couponCode) {
      const couponResult = await couponServices.applyCoupon(
        req?.body?.couponCode,
        totalAmount
      );
      discount = couponResult.discount;
      totalAmount = couponResult.finalAmount;
    }

    const order = await OrderModel.create({
      ...req.body,
      totalAmount,
      discount,
      tran_id,
      status: "pending",
      paymentStatus: "pending",
    });
    // Prepare payment request
    const paymentData = {
      name: user.name,
      email: user.email,
      price: totalAmount,
      address: req.body.shippingAddress,
      tran_id,
    };

    const sslcz = new SSLCommerzPayment(
      config.store_id,
      config.store_pass,
      is_live
    );
    const apiResponse = await sslcz.init(
      await paymentServices.createPayment(paymentData)
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Payment initiated successfully",
      url: apiResponse.GatewayPageURL || null,
      orderId: order._id,
      tran_id,
    });
    // res.redirect(apiResponse.GatewayPageURL);
  }
);

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const { transectionId } = req.params;
  const order = await OrderModel.findOne({ tran_id: transectionId });
  if (!order) throw new AppError(StatusCodes.NOT_FOUND, "Order not found");

  // Reduce stock only on success if not already reduced
  if (order.products && Array.isArray(order.products)) {
    await Promise.all(
      order.products.map(async (item) => {
        const product = await ProductModel.findById(item.productId);
        if (product) {
          await ProductModel.updateOne(
            { _id: product._id },
            { $inc: { stock: -item.quantity } }
          );
        }
      })
    );
  }

  const updatedOrder = await OrderModel.findOneAndUpdate(
    { tran_id: transectionId },
    { status: "paid", paymentStatus: "success" },
    { new: true }
  )
    .populate("products.productId", "name price stock images")
    .populate("userId", "name email");

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Payment successful",
    data: updatedOrder,
  });
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const { transectionId } = req.params;
  const order = await OrderModel.findOne({ tran_id: transectionId });
  if (!order) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Order not found",
    });
  }

  if (order.products && Array.isArray(order.products)) {
    await Promise.all(
      order.products.map(async (item) => {
        await ProductModel.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } }
        );
      })
    );
  }

  // Delete the failed order
  await OrderModel.deleteOne({ tran_id: transectionId });

  res.status(StatusCodes.OK).json({
    success: false,
    message: "Payment failed. Order cancelled and stock restored.",
  });
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  const { transectionId } = req.params;

  const order = await OrderModel.findOne({ tran_id: transectionId });
  if (!order) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Order not found",
    });
  }

  // Restore stock
  if (order.products && Array.isArray(order.products)) {
    await Promise.all(
      order.products.map(async (item) => {
        await ProductModel.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } }
        );
      })
    );
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
    message: "Payments fetched successfully",
    data: result,
    success: true,
  });
});

const getUserPayments = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const query = req.query;
  const result = await paymentServices.getUserPayments({ id: userId, query });

  sendResponse(res, {
    statusCode: 200,
    message: "User payments fetched successfully",
    data: result,
    success: true,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { transectionId } = req.params;
  const { status } = req.body;

  const result = await paymentServices.updateOrderStatus(status, transectionId);

  sendResponse(res, {
    statusCode: 200,
    message: "User payments fetched successfully",
    data: result,
    success: true,
  });
});

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.getStats();

  sendResponse(res, {
    statusCode: 200,
    message: "Stats fetched successfully",
    data: result,
    success: true,
  });
});
const getMonthlySales = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.monthlySale();

  sendResponse(res, {
    statusCode: 200,
    message: "Monthly sales fetched successfully",
    data: result,
    success: true,
  });
});

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await paymentServices.getUserStats(userId);

  sendResponse(res, {
    statusCode: 200,
    message: "User stats fetched successfully",
    data: result,
    success: true,
  });
});

const getUserYearlyBuy = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await paymentServices.getUserYearlyBuy(userId);

  sendResponse(res, {
    statusCode: 200,
    message: "user yearly buy fetched successfully",
    data: result,
    success: true,
  });
});
const userOrderSoftDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as any;
  const result = await paymentServices.softDeleteOrder(id);

  sendResponse(res, {
    statusCode: 200,
    message: "user order soft deleted successfully",
    data: result,
    success: true,
  });
});
const userOrderRestored = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as any;
  const result = await paymentServices.restoreOrder(id);

  sendResponse(res, {
    statusCode: 200,
    message: "user order restored successfully",
    data: result,
    success: true,
  });
});

export const paymentController = {
  createPaymenController,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  getPayments,
  getUserPayments,
  updateOrderStatus,
  getStats,
  getMonthlySales,
  getUserStats,
  getUserYearlyBuy,
  userOrderRestored,
  userOrderSoftDelete,
};
