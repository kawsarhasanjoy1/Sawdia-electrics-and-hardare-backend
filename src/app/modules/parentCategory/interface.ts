import { Types } from "mongoose";

export type TParentCategoryName =
  'Desktop' |
  'Laptot' |
  'Monitor' |
  'Phone' |
  'Power' |
  'Tablet' |
  'Camera' |
  'Gaming' |
  'Accessories' |
  'Tv';
export interface TParentCategory {
  name: TParentCategoryName;
  description?: string;
  isDeleted: boolean;
  isActive: boolean;
  createdBy: Types.ObjectId;
}
