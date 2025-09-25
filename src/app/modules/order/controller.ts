import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { orderServices } from "./services";
import { Request, Response } from "express";

const getOrder = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await orderServices.getOrder(query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "order fetched successful",
    data: result,
  });
});

const getUserOrder = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const query = req.query;
  const result = await orderServices.getUserOrder({ id: userId, query });

  sendResponse(res, {
    statusCode: 200,
    message: "User order fetched successfully",
    data: result,
    success: true,
  });
});

const getStats = catchAsync(async (req, res) => {
  const result = await orderServices.getStats();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Overall stats fetched successfully",
    data: result,
  });
});

const getMonthlySale = catchAsync(async (req, res) => {
  const result = await orderServices.monthlySale();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Monthly sales for last 12 months fetched successfully",
    data: result,
  });
});

const getUserStats = catchAsync(async (req, res) => {
  const { userId } = req.user;
  console.log(userId);
  const result = await orderServices.getUserStats(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User stats fetched successfully",
    data: result,
  });
});

const getUserYearlyBuy = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await orderServices.getUserYearlyBuy(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User yearly purchase (last 12 months) fetched successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await orderServices.updateOrderStatus(status, id);

  sendResponse(res, {
    statusCode: 200,
    message: "order status updated successfully",
    data: result,
    success: true,
  });
});

export const OrderController = {
  getOrder,
  getUserOrder,
  getStats,
  getMonthlySale,
  getUserStats,
  getUserYearlyBuy,
  updateOrderStatus,
};
