import AppError from '../../error/handleAppError';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { ReviewModel } from './model';


const createReview = async (payload: { userId: Types.ObjectId; productId: Types.ObjectId; rating: number; comment?: string }) => {
    const existingReview = await ReviewModel.findOne({ userId: payload.userId, productId: payload.productId })
    if (existingReview) throw new AppError(StatusCodes.CONFLICT, 'this user already has a review for this product')
    const review = await ReviewModel.create(payload);
    if (review) {
        await ReviewModel.averageRating(review.productId);
    }
    return review;
};

const getReviewsByProduct = async (productId: string) => {
    const reviews = await ReviewModel.find({ productId }).populate('userId', 'name email');
    return reviews;
};

const updateReview = async (id: string, payload: { rating?: number; comment?: string }) => {
    const review = await ReviewModel.findByIdAndUpdate(id, payload, { new: true });
    if (!review) throw new AppError(StatusCodes.NOT_FOUND, 'Review not found');
    return review;
};

const deleteReview = async (id: string) => {
    const review = await ReviewModel.findByIdAndDelete(id);
    if (!review) throw new AppError(StatusCodes.NOT_FOUND, 'Review not found');
    return { message: 'Review deleted successfully' };
}

export const ReviewServices = {
    createReview,
    getReviewsByProduct,
    updateReview,
    deleteReview
};
