import { Schema, model } from "mongoose";
import { TProduct } from "./interface";

// const ReviewSchema = new Schema(
//   {
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     name: { type: String, required: true },
//     rating: { type: Number, required: true, min: 1, max: 5 },
//     comment: { type: String },
//   },
//   { timestamps: { createdAt: true, updatedAt: false } }
// );

const ProductSchema = new Schema<TProduct>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, trim: true, unique: true },
        description: { type: String },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        brand: { type: String },
        price: { type: Number, required: true },
        discountPrice: { type: Number },
        stock: { type: Number, required: true },
        images: [{ type: String, required: true }],
        sku: { type: String },
        warranty: { type: String },
        rating: { type: Number, default: 0 },
        ratingAverage: { type: Number, default: 0 },
        ratingQuantity: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const ProductModel = model<TProduct>("Product", ProductSchema);
