import { ParentCategoryServices } from "./services";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createParentCategoryController = catchAsync(async (req, res) => {
  const category = await ParentCategoryServices.createParentCategory({
    ...req.body,
    createdBy: req.user?.userId,
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Parent category created",
    data: category,
  });
});

const getAllParentCategoriesController = catchAsync(async (req, res) => {
  const query = req.query;
  const categories = await ParentCategoryServices.getAllParentCategories(query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All parent categories",
    data: categories,
  });
});

const getParentCategoryByIdController = catchAsync(async (req, res) => {
  const category = await ParentCategoryServices.getParentCategoryById(
    req.params.id
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parent category fetched",
    data: category,
  });
});

const updateParentCategoryController = catchAsync(async (req, res) => {
  const category = await ParentCategoryServices.updateParentCategory(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parent category updated",
    data: category,
  });
});

const deleteParentCategoryController = catchAsync(async (req, res) => {
  const result = await ParentCategoryServices.deleteParenCategory(
    req.params.id
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parent category deleted",
    data: result,
  });
});
const restoreParentCategory = catchAsync(async (req, res) => {
  const result = await ParentCategoryServices.restoreParentCategory(
    req.params.id
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parent category restored",
    data: result,
  });
});

export const ParentCategoryControllers = {
  createParentCategoryController,
  getAllParentCategoriesController,
  getParentCategoryByIdController,
  updateParentCategoryController,
  deleteParentCategoryController,
  restoreParentCategory,
};
