import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { CategoryServices } from './services';

// Create Category
 const createCategoryController = catchAsync(async (req: Request, res: Response) => {
    const payload = {
        ...req.body,
        createdBy: req.user?.userId,
    };
    const category = await CategoryServices.createCategory(payload);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Category created successfully',
        data: category,
    });
});

 const getAllCategoriesController = catchAsync(async (req: Request, res: Response) => {
    const categories = await CategoryServices.getAllCategories(req.query);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
    });
});

 const getCategoryByIdController = catchAsync(async (req: Request, res: Response) => {
    const category = await CategoryServices.getCategoryById(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Category retrieved successfully',
        data: category,
    });
});

 const updateCategoryController = catchAsync(async (req: Request, res: Response) => {
    const category = await CategoryServices.updateCategory(req.params.id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Category updated successfully',
        data: category,
    });
});


 const deleteCategoryController = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryServices.deleteCategory(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Category deleted successfully',
        data: result,
    });
});


// Restore category
export const restoreCategoryController = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryServices.restoreCategory(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category restored successfully",
        data: result,
    });
});


export const CategoryControllers = {
    createCategoryController,
    getAllCategoriesController,
    getCategoryByIdController,
    updateCategoryController,
    deleteCategoryController,
    restoreCategoryController,
};