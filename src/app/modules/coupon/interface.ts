import { Types } from "mongoose";

export interface TCoupon {
  userId: Types.ObjectId;
  code: string;
  discountType: "percentage";
  amount: number;
  expiryDate: Date;
  minPurchase: number;
  isActive: boolean;
}