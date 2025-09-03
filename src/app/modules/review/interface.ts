import { Types } from "mongoose";

export interface TReview {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  comment?: string;
}
