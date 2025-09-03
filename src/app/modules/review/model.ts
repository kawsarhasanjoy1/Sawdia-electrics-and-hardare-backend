import { model, Schema, Types } from "mongoose";
import { TReview, TReviewModelType } from "./interface";
import { ProductModel } from "../product/model";

const ReviewSchema = new Schema<TReview, TReviewModelType>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: '' },
    },
    { timestamps: true }
);

ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

ReviewSchema.statics.averageRating = async function (productId: Types.ObjectId) {
    const result = await this.aggregate([
        { $match: { productId } },
        { $group: { _id: null, averageRating: { $avg: "$rating" }, totalRating: { $sum: 1 } } }
    ]);
    if (result.length > 0) {
        await ProductModel.findByIdAndUpdate(productId, {
            ratingAverage: result[0].averageRating,
            ratingQuantity: result[0].totalRating
        })
    } else {
        await ProductModel.findByIdAndUpdate(productId, {
            ratingAverage: 0,
            ratingQuantity: 0
        })
    }
    return result[0]?.averageRating || 0;
};

export const ReviewModel = model<TReview, TReviewModelType>('Review', ReviewSchema);