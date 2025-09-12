import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { BrandService } from "./services";

const createBrandController = catchAsync(async (req, res) => {
  const brand = await BrandService.createBrand({
    ...req.body,
    createdBy: req.user?.userId,
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Brand created successfully",
    data: brand,
  });
});

const getAllBrandsController = catchAsync(async (req, res) => {
  const query = req.query;
  const brands = await BrandService.getAllBrands(query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All brands fetched successfully",
    data: brands,
  });
});

const getBrandByIdController = catchAsync(async (req, res) => {
  const brand = await BrandService.getBrandById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Brand fetched successfully",
    data: brand,
  });
});

const updateBrandController = catchAsync(async (req, res) => {
  const brand = await BrandService.updateBrand(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Brand updated successfully",
    data: brand,
  });
});

const softDeleteBrandController = catchAsync(async (req, res) => {
  const id = req.params.id;
  const brand = await BrandService.softDeleteBrand(id as any);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Brand soft deleted successfully",
    data: brand,
  });
});

const restoreBrandController = catchAsync(async (req, res) => {
  const id = req.params.id;
  const brand = await BrandService.restoreBrand(id as any);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Brand restored successfully",
    data: brand,
  });
});

export const BrandControllers = {
  createBrandController,
  getAllBrandsController,
  getBrandByIdController,
  updateBrandController,
  softDeleteBrandController,
  restoreBrandController,
};
