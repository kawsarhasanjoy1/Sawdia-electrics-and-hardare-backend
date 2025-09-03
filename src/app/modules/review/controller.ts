import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ReviewServices } from './services';

 const createReviewController = catchAsync(async (req: Request, res: Response) => {
    const review = await ReviewServices.createReview(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Review created successfully',
        data: review
    });
});

 const getReviewsByProductController = catchAsync(async (req: Request, res: Response) => {
    const reviews = await ReviewServices.getReviewsByProduct(req.params.productId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Reviews retrieved successfully',
        data: reviews
    });
});

 const updateReviewController = catchAsync(async (req: Request, res: Response) => {
    const review = await ReviewServices.updateReview(req.params.id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review updated successfully',
        data: review
    });
});

 const deleteReviewController = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewServices.deleteReview(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review deleted successfully',
        data: result,
    });
});


export const ReviewController  = {
    createReviewController,
    getReviewsByProductController,
    updateReviewController,
    deleteReviewController,
}