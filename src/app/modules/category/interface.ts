import { Types } from 'mongoose';
import { SubCategoryName } from '../../constance/global';

export interface TCategory {
  name: SubCategoryName;
  description?: string;
  parentCategory: Types.ObjectId;
  createdBy: Types.ObjectId; 
  isDeleted: boolean
}
