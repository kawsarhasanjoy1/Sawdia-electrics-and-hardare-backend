import { Schema, model } from "mongoose";
import { TCoupon } from "./interface";



const couponSchema = new Schema<TCoupon>(
    {
        userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
        code: { type: String, required: true, unique: true, uppercase: true },
        discountType: { type: String, enum: ["percentage"], required: true },
        amount: { type: Number, required: true },
        expiryDate: { type: Date, required: true },
        minPurchase: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const CouponModel = model<TCoupon>("Coupon", couponSchema);
