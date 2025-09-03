import { Model, Types } from "mongoose";

export interface TReview {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  comment?: string;
}


export interface TReviewModelType extends Model<TReview> {
  averageRating: (productId: Types.ObjectId) => Promise<any>;
}