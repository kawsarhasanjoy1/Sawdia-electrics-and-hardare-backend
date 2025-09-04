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
  isPublished?: boolean;
  publishedAt?: Date;
}
