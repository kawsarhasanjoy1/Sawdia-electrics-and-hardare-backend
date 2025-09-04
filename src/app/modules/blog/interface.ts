// types/blog.interface.ts
import { Types } from "mongoose";

export interface TBlog {
    title: string;
    slug: string;
    content: string;
    author: Types.ObjectId;
    category?: string;
    tags?: string[];
    image?: string;
    viewsCount?: number;
    isPublished?: boolean;
    publishedAt?: Date;
    isDeleted: boolean
}
