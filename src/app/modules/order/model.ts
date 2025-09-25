// order.model.ts
import mongoose, { Schema, Document } from "mongoose";
import { TOrder } from "./interface";

const orderSchema = new Schema<TOrder>(
  {
    userId: { type: String, required: true, ref: "User" },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
      },
    ],
    shippingAddress: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      postcode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    notes: { type: String },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    discount: { type: Number, required: true },
    totalPayable: { type: Number, required: true },
    currency: { type: String, required: true },
    couponCode: { type: String },
    transactionId: { type: String, required: true, unique: true },
    gateway: { type: String, default: "SSLCommerz" },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"],
      default: "PENDING",
    },
    gatewayPayload: { type: Schema.Types.Mixed },
    redirectUrl: { type: String },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<TOrder>("Order", orderSchema);
