import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { blogServices } from "./services";


const createBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.createBlog(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog created successfully",
    data: result,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await blogServices.updateBlog(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog updated successfully",
    data: result,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await blogServices.deleteBlog(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog deleted successfully",
    data: result,
  });
});

const getBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await blogServices.getBlogById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog fetched successfully",
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.getBlogs(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All blogs fetched successfully",
    data: result,
  });
});

export const blogController = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getAllBlogs,
};
