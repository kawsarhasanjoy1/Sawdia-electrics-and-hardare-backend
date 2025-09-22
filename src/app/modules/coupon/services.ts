import AppError from "../../error/handleAppError";
import { StatusCodes } from "http-status-codes";
import { TCoupon } from "./interface";
import { CouponModel } from "./model";
import QueryBuilders from "../../builders/queryBuilders";
const createCoupon = async (payload: TCoupon) => {
  const coupon = await CouponModel.findOne({
    code: payload.code.toUpperCase(),
  });
  if (coupon) {
    throw new AppError(StatusCodes.CONFLICT, "This coupon already exists!");
  }
  if (new Date(payload.expiryDate) <= new Date()) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Expiry date must be a future date"
    );
  }

  // normalize coupon code to uppercase
  payload.code = payload.code.toUpperCase();

  return await CouponModel.create(payload);
};

const getCoupons = async (query: any) => {
  const searchQuery = new QueryBuilders(
    CouponModel.find().populate("userId"),
    query
  )
    .search(["code"])
    .filter()
    .pagination()
    .sort();
  const data = await searchQuery.QueryModel;
  const meta = await searchQuery.countTotal();

  return { meta, data };
};

const updateCoupon = async (id: string, payload: Partial<TCoupon>) => {
  const coupon = await CouponModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!coupon) {
    throw new AppError(StatusCodes.NOT_FOUND, "Coupon not found");
  }
  return coupon;
};

const deleteCoupon = async (id: string) => {
  const coupon = await CouponModel.findByIdAndDelete(id);
  if (!coupon) {
    throw new AppError(StatusCodes.NOT_FOUND, "Coupon not found");
  }
  return coupon;
};

const applyCoupon = async (code: string, orderAmount: number) => {
  const coupon = await CouponModel.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });
  if (!coupon) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Invalid or expired coupon code"
    );
  }

  if (new Date(coupon?.expiryDate) < new Date()) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Coupon expired");
  }

  if (orderAmount < coupon?.minPurchase) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Minimum purchase must be ${coupon?.minPurchase}`
    );
  }

  let discount = 0;
  if (coupon?.discountType === "percentage") {
    const discountPercent = coupon?.amount / coupon?.minPurchase;
    discount =  orderAmount * discountPercent
  } else {
    discount = coupon?.amount;
  }
  console.log(discount);
  const finalAmount = orderAmount - discount;

  return {
    coupon,
    discount,
    finalAmount: finalAmount > 0 ? finalAmount : 0,
  };
};

export const couponServices = {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
