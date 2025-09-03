import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import { TParentCategory } from './interface';
import { parentCategoryNames } from './constance';

const ParentCategorySchema = new Schema<TParentCategory>(
  {
    name: { type: String, enum: parentCategoryNames, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

ParentCategorySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

export const ParentCategoryModel = model<TParentCategory>('ParentCategory', ParentCategorySchema);
