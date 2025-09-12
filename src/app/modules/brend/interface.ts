import { Types } from "mongoose";

export interface TBrand {
  name: string;
  categoryId: Types.ObjectId;
  createdBy: Types.ObjectId;
  isDeleted?: boolean;
}
