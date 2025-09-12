import AppError from "../../error/handleAppError";
import { StatusCodes } from "http-status-codes";
import { TCategory } from "./interface";
import { CategoryModel } from "./model";
import slugify from "slugify";
import { ParentCategoryModel } from "../parentCategory/model";
import { Restore, softDelete } from "../../helpers/softDelete";
import QueryBuilders from "../../builders/queryBuilders";

const createCategory = async (payload: TCategory) => {
  const parentCategory = await ParentCategoryModel.findById({
    _id: payload.parentCategory,
  });
  if (!parentCategory)
    throw new AppError(StatusCodes.NOT_FOUND, "Parent category not found");
  const category = await CategoryModel.create(payload);
  return category;
};

const getAllCategories = async (query: Record<string, any>) => {
  const categoryQuery = new QueryBuilders(
    CategoryModel.find()
      .populate("parentCategory")
      .populate("createdBy", "name email role"),
    query
  ).filter();
  const categories = await categoryQuery.QueryModel;
  return categories;
};

const getCategoryById = async (id: string) => {
  const category = await CategoryModel.findById(id)
    .populate("parentCategory")
    .populate("createdBy", "name email role");
  if (!category)
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  return category;
};

const updateCategory = async (id: string, payload: Partial<TCategory>) => {
  const category = await CategoryModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!category)
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  return category;
};

const deleteCategory = async (id: string) => {
  const result = await softDelete(CategoryModel, id as any);
  return result;
};

const restoreCategory = async (id: string) => {
  const result = await Restore(CategoryModel, id as any);
  return result;
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  restoreCategory,
};
