import { Types } from 'mongoose';

export interface TCategory {
  name: string;
  slug: string;
  description?: string;
  parentCategory: Types.ObjectId;
  createdBy: Types.ObjectId; 
  isDeleted: boolean
}
