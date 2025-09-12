import { Types } from "mongoose";

export interface TFavourite {
  userId: Types.ObjectId;
  productId: Types.ObjectId; 
}
