// models/blog.model.ts
import { Schema, model } from "mongoose";
import { TBlog } from "./interface";

const BlogSchema = new Schema<TBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String },
    isPublished: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BlogModel = model<TBlog>("Blog", BlogSchema);
