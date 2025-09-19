import { BrandModel } from "./model";
import { TBrand } from "./interface";
import { Restore, softDelete } from "../../helpers/softDelete";
import { Types } from "mongoose";
import { CategoryModel } from "../category/model";
import { StatusCodes } from "http-status-codes";
import { allBrands, AllCategoryName } from "../../constance/global";
import AppError from "../../error/handleAppError";
import QueryBuilders from "../../builders/queryBuilders";

const createBrand = async (payload: TBrand) => {
  const category = await CategoryModel.findById(payload.categoryId);
  if (!category)
    throw new AppError(StatusCodes.NOT_FOUND, "category not found");
  const validBrands = allBrands[category?.name as AllCategoryName];
  if (!validBrands.includes(payload?.name)) {
    throw new Error(
      `${payload.name} is not a valid brand for this category ${category.name}`
    );
  }
  const brand = new BrandModel(payload);
  return await brand.save();
};

const getAllBrands = async (query: Record<string, any>) => {
  const searchableField = ["name"];
  const queryBrand = new QueryBuilders(
    BrandModel.find()
      .populate("createdBy", "name email")
      .populate("categoryId", "name"),
    query
  )
    .filter()
    .search(searchableField)
    .sort()
    .pagination();
  const data = await queryBrand.QueryModel;
  const meta = await queryBrand.countTotal();
  return { data, meta };
};

const getBrandById = async (id: string) => {
  return await BrandModel.findById(id).populate("createdBy", "name email");
};

const updateBrand = async (id: string, data: Partial<TBrand>) => {
  return await BrandModel.findByIdAndUpdate(id, data, { new: true });
};

const softDeleteBrand = async (id: Types.ObjectId) => {
  return await softDelete(BrandModel, id);
};

const restoreBrand = async (id: Types.ObjectId) => {
  return await Restore(BrandModel, id);
};

export const BrandService = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  softDeleteBrand,
  restoreBrand,
};
