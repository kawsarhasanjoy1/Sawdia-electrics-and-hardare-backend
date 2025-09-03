import { model, Schema } from 'mongoose';
import { TCategory } from './interface';


const CategorySchema = new Schema<TCategory>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, default: '' },
        parentCategory: { type: Schema.Types.ObjectId, ref: 'ParentCategory', required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const CategoryModel = model<TCategory>('Category', CategorySchema);
