import AppError from '../../error/handleAppError';
import { StatusCodes } from 'http-status-codes';
import { TProduct } from './interface';
import { ProductModel } from './model';
import { UserModel } from '../user/model';
import { CategoryModel } from '../category/model';
import { Restore, softDelete } from '../../helpers/softDelete';

const createProduct = async (payload: TProduct) => {
    const user = await UserModel.findOne({ _id: payload.userId })

    const isExistCategory = await CategoryModel.findOne({ _id: payload.category, isDeleted: false })
    if (!isExistCategory) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Category not found')
    }
    await UserModel.isUserExistsByEmail(user?.email as string)
    const product = await ProductModel.create(payload);
    return product;
};

const getAllProducts = async (query: Record<string, any>) => {
    const products = await ProductModel.find({ isDeleted: false }).populate('category');

    return products;
};

const getProductById = async (id: string) => {
    const product = await ProductModel.findById(id).populate('category');
    if (!product) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
    return product;
};

const updateProduct = async (id: string, payload: Partial<TProduct>) => {
    const product = await ProductModel.findByIdAndUpdate(id, payload, { new: true });
    if (!product) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
    return product;
};

const deleteProduct = async (id: string) => {
    const result = await softDelete(ProductModel, id as any)
    return result
};

const restoreProduct = async (id: string) => {
    const result = await Restore(ProductModel, id as any)
    return result
};

export const ProductServices = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    restoreProduct,
};
