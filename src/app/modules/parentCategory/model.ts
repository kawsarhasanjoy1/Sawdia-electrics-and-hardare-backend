import { Schema, model } from "mongoose";
import slugify from "slugify";
import { TParentCategory } from "./interface";
import { parentCategoryNames } from "./constance";

const ParentCategorySchema = new Schema<TParentCategory>(
  {
    name: {
      type: String,
      enum: parentCategoryNames,
      required: true,
      trim: true,
      unique: true,
    },
    description: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const ParentCategoryModel = model<TParentCategory>(
  "ParentCategory",
  ParentCategorySchema
);
