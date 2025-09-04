import { model, Schema } from "mongoose";
import { TAddress, TOrder, TOrderProduct } from "./interface";

const AddressSchema = new Schema<TAddress>({
    line1: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
    phone: { type: String, required: true },
});

const OrderProductSchema = new Schema<TOrderProduct>({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true }
});

const OrderSchema = new Schema<TOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        tran_id: { type: String },
        products: { type: [OrderProductSchema], required: true },
        totalAmount: { type: Number, required: true },
        shippingFee: { type: Number },
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered", "cancelled", "returned"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "success", "failed", "refunded"],
            default: "pending",
        },
        shippingAddress: { type: AddressSchema, required: true },
        couponCode: { type: String },
        trackingNumber: { type: String },
        notes: { type: String },
        discount: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export const OrderModel = model<TOrder>("Order", OrderSchema);