import AppError from "../../error/handleAppError";
import { StatusCodes } from "http-status-codes";
import { TBlog } from "./interface";
import { BlogModel } from "./model";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary.ts";
import { Restore, softDelete } from "../../helpers/softDelete";

const createBlog = async (payload: TBlog, image: any) => {
  const cloudinary: any = await sendImageToCloudinary(
    image?.path,
    image?.filename
  );
  payload.image = cloudinary?.secure_url;
  const blog = await BlogModel.create(payload);
  return blog;
};

const getBlogs = async (query: Record<string, any>) => {
  return await BlogModel.find({ isDeleted: false })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
};

const getBlogById = async (id: string) => {
  const blog = await BlogModel.findByIdAndUpdate(
    { _id: id, isDeleted: false },
    { $inc: { viewsCount: 1 } },
    { new: true }
  );
  if (!blog) throw new AppError(StatusCodes.NOT_FOUND, "Blog not found");
  return blog;
};

const updateBlog = async (id: string, payload: Partial<TBlog>) => {
  const blog = await BlogModel.findByIdAndUpdate(id, payload, { new: true });
  if (!blog) throw new AppError(StatusCodes.NOT_FOUND, "Blog not found");
  return blog;
};

const softDeleteBlog = async (id: string) => {
  const blog = softDelete(BlogModel, id as never);
  return blog;
};
const restoreBlog = async (id: string) => {
  const blog = Restore(BlogModel, id as never);
  return blog;
};

const togglePublishStatus = async (id: string) => {
  const blog = await BlogModel.findById(id);
  if (!blog) {
    throw new AppError(StatusCodes.NOT_FOUND, "Blog not found");
  }

  const updatedBlog = await BlogModel.findByIdAndUpdate(
    id,
    { isPublished: !blog.isPublished },
    { new: true }
  );

  return updatedBlog;
};

export const blogServices = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  softDeleteBlog,
  restoreBlog,
  togglePublishStatus,
};
