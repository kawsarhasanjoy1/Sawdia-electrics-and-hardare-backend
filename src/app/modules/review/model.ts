import { model, Schema } from "mongoose";
import { TReview } from "./interface";

const ReviewSchema = new Schema<TReview>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: '' },
    },
    { timestamps: true }
);

ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const ReviewModel = model<TReview>('Review', ReviewSchema);