import { StatusCodes } from "http-status-codes";
import { TProduct } from "./interface";
import { ProductModel } from "./model";
import { UserModel } from "../user/model";
import { CategoryModel } from "../category/model";
import { Restore, softDelete } from "../../helpers/softDelete";
import AppError from "../../error/handleAppError";
import QueryBuilders from "../../builders/queryBuilders";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary.ts";

const createProduct = async (payload: TProduct, users: any, images: any[]) => {
  payload.images = [];
  for (let image of images) {
    const cloudinary: any = await sendImageToCloudinary(
      image?.path,
      image?.filename
    );
    payload.images.push(cloudinary?.secure_url as string);
  }
  const user = await UserModel.findOne({ _id: users?.userId });
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "not found");
  payload.userId = user?._id;
  const isExistCategory = await CategoryModel.findOne({
    _id: payload.categoryId,
    isDeleted: false,
  });
  if (!isExistCategory) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }

  await UserModel.isUserExistsByEmail(user?.email as string);
  const product = await ProductModel.create(payload);
  return product;
};

const getAllProducts = async (query: Record<string, any>) => {
  const {
    parentCategory,
    category,
    brand,
    searchTerm,
    minPrice,
    maxPrice,
    rating,
    page,
    limit,
    ...rest
  } = query;

  const searchAbleFields = ["name", "sku"];
  const queryObj: Record<string, any> = { ...rest };

  if (category) {
    queryObj.categoryId = category;
  } else if (parentCategory) {
    const subCategories = await CategoryModel.find({ parentCategory }).select(
      "_id"
    );
    const subIds = subCategories.map((c) => c._id);
    queryObj.categoryId = { $in: subIds };
  }

  if (brand) {
    queryObj.brandId = brand;
  }

  if (minPrice || minPrice > 0 || maxPrice || maxPrice > 0) {
    const priceFilter: Record<string, number> = {};
    if (minPrice && minPrice > 0) priceFilter.$gte = minPrice;
    if (maxPrice && maxPrice > 0) priceFilter.$lte = maxPrice;
    if (Object.keys(priceFilter).length > 0) {
      queryObj.price = priceFilter;
    }
  }

  if (rating) {
    queryObj.ratingAverage = { $gte: rating };
  }

  const productQuery = new QueryBuilders(
    ProductModel.find()
      .populate("categoryId")
      .populate("brandId")
      .populate("reviews"),
    { ...queryObj, searchTerm, page, limit }
  )
    .search(searchAbleFields)
    .filter()
    .sort()
    .pagination();

  const products = await productQuery.QueryModel;
  return products;
};

const getProductById = async (id: string) => {
  const product = await ProductModel.findById(id)
    .populate("categoryId")
    .populate({
      path: "reviews",
      options: { sort: { createdAt: -1 }, limit: 5 },
      populate: { path: "userId", select: "name image" },
    });
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  return product;
};

const updateProduct = async (
  id: string,
  payload: Partial<TProduct> & {
    imageUpdates?: { index: number; newImage: string }[];
  }
) => {
  const product = await ProductModel.findById(id);
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, "Product not found");

  if (payload.imageUpdates && Array.isArray(payload.imageUpdates)) {
    for (const { index, newImage } of payload.imageUpdates) {
      if (product?.images?.[index]) {
        product.images[index] = newImage;
      }
    }
  }

  const { imageUpdates, ...restPayload } = payload;
  const update = await ProductModel.findByIdAndUpdate(
    { _id: id },
    { ...restPayload, images: product.images },
    { new: true }
  );

  return update;
};

const updateProductSave = async (userId: string, productId: string) => {
  const user = await UserModel.findById(userId);
  const product = await ProductModel.findById(productId);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  const result = await ProductModel.findByIdAndUpdate(
    productId,
    {
      $inc: { favouriteCount: 1 },
      favourite: { userId, productId },
    },
    { new: true }
  );

  return result;
};
const deleteProduct = async (id: string) => {
  const result = await softDelete(ProductModel, id as any);
  return result;
};

const restoreProduct = async (id: string) => {
  const result = await Restore(ProductModel, id as any);
  return result;
};

export const ProductServices = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  restoreProduct,
  updateProductSave,
};
