import { Types } from "mongoose";

export interface TBrand {
  name: string;
  parentCategory: Types.ObjectId;

  categoryId: Types.ObjectId;
  createdBy: Types.ObjectId;
  isDeleted?: boolean;
}
