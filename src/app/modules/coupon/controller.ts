import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { couponServices } from "./services";

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await couponServices.createCoupon({
    userId: userId,
    ...req.body,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Coupon created successfully",
    data: result,
  });
});

const getCoupons = catchAsync(async (req: Request, res: Response) => {
  const result = await couponServices.getCoupons(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Coupons fetched successfully",
    data: result,
  });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await couponServices.updateCoupon(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Coupon updated successfully",
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await couponServices.deleteCoupon(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Coupon deleted successfully",
    data: result,
  });
});

const applyCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code, orderAmount } = req.body;
  const result = await couponServices.applyCoupon(code, orderAmount);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Coupon applied successfully",
    data: result,
  });
});

export const couponController = {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
