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
const FavouriteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
});

const ProductSchema = new Schema<TProduct>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: { type: Number, required: true },
    images: [{ type: String, required: true }],
    sku: { type: String },
    warranty: { type: String },
    rating: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
    ratingQuantity: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    favouriteCount: { type: Number, default: 0 },
    favourite: { type: FavouriteSchema },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});

export const ProductModel = model<TProduct>("Product", ProductSchema);
