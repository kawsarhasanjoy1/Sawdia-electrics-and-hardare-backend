import { Schema, model } from "mongoose";
import { TOrder } from "./interface";

const OrderSchema = new Schema<TOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: { type: Number, required: true, min: 1 },
            },
        ],
        totalPrice: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["cod", "sslcommerz", "stripe"],
            default: "cod",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
        },
        shippingAddress: { type: String, required: true },
    },
    { timestamps: true }
);

export const OrderModel = model<TOrder>("Order", OrderSchema);
