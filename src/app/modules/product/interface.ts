import { Document, Types } from "mongoose";

// export interface TReview {
//   userId: Types.ObjectId;
//   name: string;
//   rating: number;
//   comment?: string;
//   createdAt?: Date;
// }

export interface TProduct {
    userId: Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    category: Types.ObjectId;
    brand?: string;
    price: number;
    discountPrice?: number;
    stock: number;
    images?: string[];
    sku?: string;
    warranty?: string;
    rating?: number;
    isDeleted: boolean;
    ratingAverage: number;
    ratingQuantity: number;
}
