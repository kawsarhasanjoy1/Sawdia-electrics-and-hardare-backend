import { model, Schema } from "mongoose";
import { TBrand } from "./interface";

const BrandSchema = new Schema<TBrand>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BrandModel = model<TBrand>("Brand", BrandSchema);
