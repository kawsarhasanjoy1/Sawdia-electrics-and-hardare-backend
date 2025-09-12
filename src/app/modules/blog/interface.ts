// types/blog.interface.ts
import { Types } from "mongoose";

export interface TBlog {
    title: string;
    content: string;
    userId: Types.ObjectId;
    image?: string;
    viewsCount?: number;
    isPublished?: boolean;
    isDeleted: boolean
}
