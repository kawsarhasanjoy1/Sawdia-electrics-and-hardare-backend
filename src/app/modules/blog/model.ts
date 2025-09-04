// models/blog.model.ts
import { Schema, model } from "mongoose";
import { TBlog } from "./interface";


const BlogSchema = new Schema<TBlog>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    category: { type: String },
    tags: [{ type: String }],
    image: { type: String },
    isPublished: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
    publishedAt: { type: Date },
    isDeleted: {type: Boolean, default: false}
}, { timestamps: true });

export const BlogModel = model<TBlog>("Blog", BlogSchema);
