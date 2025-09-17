// modules/favourite/model.ts
import { Schema, model } from "mongoose";
import { TFavourite } from "./interface";

const FavouriteSchema = new Schema<TFavourite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

FavouriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const FavouriteModel = model<TFavourite>("Favourite", FavouriteSchema);
