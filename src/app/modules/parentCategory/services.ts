import AppError from "../../error/handleAppError";
import { StatusCodes } from "http-status-codes";
import { ParentCategoryModel } from "./model";
import { TParentCategory } from "./interface";
import { Restore, softDelete } from "../../helpers/softDelete";
import QueryBuilders from "../../builders/queryBuilders";

const createParentCategory = async (payload: TParentCategory) => {
  const existing = await ParentCategoryModel.findOne({ name: payload.name });
  if (existing)
    throw new AppError(StatusCodes.CONFLICT, "Parent category already exists");

  const parentCategory = await ParentCategoryModel.create(payload);
  return parentCategory;
};

const getAllParentCategories = async (query: Record<string, any>) => {
  const querySearch = new QueryBuilders(
    ParentCategoryModel.find().populate("createdBy", "name email role"),
    query
  )
    .filter()
    .search(["name"])
    .sort()
    .pagination();
  const data = await querySearch.QueryModel;
  const meta = await querySearch.countTotal();
  return { data, meta };
};

const getParentCategoryById = async (id: string) => {
  const category = await ParentCategoryModel.findById(id).populate(
    "createdBy",
    "name email role"
  );
  if (!category)
    throw new AppError(StatusCodes.NOT_FOUND, "Parent category not found");
  return category;
};

const updateParentCategory = async (
  id: string,
  payload: Partial<TParentCategory>
) => {
  const category = await ParentCategoryModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!category)
    throw new AppError(StatusCodes.NOT_FOUND, "Parent category not found");
  return category;
};

const deleteParenCategory = async (id: string) => {
  const result = await softDelete(ParentCategoryModel, id as any);
  return result;
};

const restoreParentCategory = async (id: string) => {
  const result = await Restore(ParentCategoryModel, id as any);
  return result;
};

export const ParentCategoryServices = {
  createParentCategory,
  getAllParentCategories,
  getParentCategoryById,
  updateParentCategory,
  deleteParenCategory,
  restoreParentCategory,
};
