import { model, Schema } from "mongoose";
import { TCategory } from "./interface";
import {
  ParentCategoryName,
  parentToSubCategories,
} from "../../constance/global";

const CategorySchema = new Schema<TCategory>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "ParentCategory",
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CategorySchema.pre("save", async function (next) {
  const doc = this as TCategory & { parentCategoryName?: ParentCategoryName };
  if (!doc.parentCategoryName) return next();

  const validSubs = parentToSubCategories[doc.parentCategoryName];
  if (!validSubs.includes(doc?.name as never)) {
    return next(
      new Error(
        `${doc.name} is not a valid sub-category for ${doc.parentCategoryName}`
      )
    );
  }
  next();
});

export const CategoryModel = model<TCategory>("Category", CategorySchema);
