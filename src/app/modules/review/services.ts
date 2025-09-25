import AppError from "../../error/handleAppError";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { ReviewModel } from "./model";

const createReview = async (payload: {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  comment?: string;
}) => {
  const existingReview = await ReviewModel.findOne({
    userId: payload.userId,
    productId: payload.productId,
  });
  if (existingReview) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "This user already has a review for this product"
    );
  }
  // const order = await OrderModel.findOne({
  //     userId: payload.userId,
  //     "products.productId": payload.productId,
  //     status: "delivered",
  // });
  // if (!order) {
  //     throw new AppError(
  //         StatusCodes.BAD_REQUEST,
  //         "You can only review this product after your order is delivered"
  //     );
  // }
  const review = await ReviewModel.create(payload);
  if (review) {
    await ReviewModel.averageRating(review.productId);
  }
  return review;
};

const getReviewsByProduct = async () => {
  const reviews = await ReviewModel.find()
    .populate("userId", "name email")
    .populate("productId");
  return reviews;
};
const getUserReview = async (userId: string) => {
  const reviews = await ReviewModel.find({ userId })
    .populate("userId", "name email")
    .populate("productId");
  return reviews;
};

const updateReview = async (
  reviewId: string,
  userId: Types.ObjectId,
  payload: { rating?: number; comment?: string }
) => {
  const review = await ReviewModel.findById(reviewId);
  if (!review) throw new AppError(StatusCodes.NOT_FOUND, "Review not found");

  if (review.userId.toString() !== userId.toString()) {
    throw new AppError(StatusCodes.FORBIDDEN, "You cannot update this review");
  }
  Object.assign(review, payload);
  await review.save();
  await ReviewModel.averageRating(review.productId);

  return review;
};

const deleteReview = async (
  reviewId: string,
  userId: Types.ObjectId,
  isAdmin = false
) => {
  const review = await ReviewModel.findById(reviewId);
  if (!review) throw new AppError(StatusCodes.NOT_FOUND, "Review not found");
  if (!isAdmin && review.userId.toString() !== userId.toString()) {
    throw new AppError(StatusCodes.FORBIDDEN, "You cannot delete this review");
  }
  await ReviewModel.findByIdAndDelete(reviewId);
  await ReviewModel.averageRating(review.productId);

  return review;
};

export const ReviewServices = {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
  getUserReview,
};
