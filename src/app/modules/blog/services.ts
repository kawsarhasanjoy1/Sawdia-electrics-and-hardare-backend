import AppError from "../../error/handleAppError";
import { StatusCodes } from "http-status-codes";
import { TBlog } from "./interface";
import { BlogModel } from "./model";


const createBlog = async (payload: TBlog) => {
    const blog = await BlogModel.create(payload);
    return blog;
};

const getBlogs = async (query: Record<string, any>) => {
    return await BlogModel.find().populate("productId", "name price images").sort({ createdAt: -1 });
};

const getBlogById = async (id: string) => {
    const blog = await BlogModel.findById(id).populate("productId", "name price images");
    if (!blog) throw new AppError(StatusCodes.NOT_FOUND, "Blog not found");
    return blog;
};

const updateBlog = async (id: string, payload: Partial<TBlog>) => {
    const blog = await BlogModel.findByIdAndUpdate(id, payload, { new: true });
    if (!blog) throw new AppError(StatusCodes.NOT_FOUND, "Blog not found");
    return blog;
};

const deleteBlog = async (id: string) => {
    const blog = await BlogModel.findByIdAndDelete(id);
    if (!blog) throw new AppError(StatusCodes.NOT_FOUND, "Blog not found");
    return blog;
};

export const blogServices = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
};
