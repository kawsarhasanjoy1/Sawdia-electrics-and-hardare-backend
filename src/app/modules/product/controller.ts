import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ProductServices } from './services';
import sendResponse from '../../utils/sendResponse';

// Create Product
 const createProductController = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductServices.createProduct(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

// Get All Products
 const getAllProductsController = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const data = await ProductServices.getAllProducts(query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products retrieved successfully',
    data,
  });
});

// Get Single Product
 const getProductByIdController = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductServices.getProductById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  });
});

// Update Product
 const updateProductController = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductServices.updateProduct(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});

// Delete Product
 const deleteProductController = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.deleteProduct(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});
 const restoreProductController = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.restoreProduct(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product restored successfully',
    data: result,
  });
});


export const productController = {
    createProductController,
    getAllProductsController,
    getProductByIdController,
    updateProductController,
    deleteProductController,
    restoreProductController
}