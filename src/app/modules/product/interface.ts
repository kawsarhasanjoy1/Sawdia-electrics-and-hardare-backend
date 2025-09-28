import { Document, Types } from "mongoose";

interface TFavourite {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
}
export interface TProduct {
  userId: Types.ObjectId;
  name: string;
  description: string;
  parentCategory: Types.ObjectId;
  categoryId: Types.ObjectId;
  brandId: Types.ObjectId;
  price: number;
  discountPrice?: number;
  stock: number;
  variants: any;
  images?: string[];
  sku?: string;
  warranty?: string;
  rating?: number;
  isDeleted: boolean;
  ratingAverage: number;
  ratingQuantity: number;
  favouriteCount?: number;
  favourite?: TFavourite;
}
