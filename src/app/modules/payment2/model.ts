// payment.model.ts
import { Schema, model, Types } from "mongoose";

const PaymentSchema = new Schema(
  {
    transactionId: { type: String, index: true, required: true, unique: true },
    orderId: { type: Types.ObjectId, ref: "Order", required: true }, // NEW
    userId: { type: String, required: true, ref: "User" }, // NEW
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    status: {
      type: String,
      enum: ["INITIATED", "VALID", "FAILED", "CANCELLED"],
      default: "INITIATED",
    },
    valId: { type: String },
    bankTranId: { type: String },
    rawInit: { type: Schema.Types.Mixed },
    rawValidation: { type: Schema.Types.Mixed },
    rawIpn: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const  PaymentModel= model("Payment", PaymentSchema);
