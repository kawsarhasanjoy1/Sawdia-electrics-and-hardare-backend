import { StatusCodes } from 'http-status-codes';
import { TProduct } from './interface';
import { ProductModel } from './model';
import { UserModel } from '../user/model';
import { CategoryModel } from '../category/model';
import { Restore, softDelete } from '../../helpers/softDelete';
import AppError from '../../error/handleAppError';
import QueryBuilders from '../../builders/queryBuilders';


const createProduct = async (payload: TProduct, users: any) => {
    const user = await UserModel.findOne({ _id: users?.userId })
    payload.userId = users?.userId
    const isExistCategory = await CategoryModel.findOne({ _id: payload.category, isDeleted: false })
    if (!isExistCategory) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Category not found')
    }

    await UserModel.isUserExistsByEmail(user?.email as string)
    const product = await ProductModel.create(payload);
    return product;
};

const getAllProducts = async (query: Record<string, any>) => {
    const searchAbleFields = ['name', 'brand', 'category.name', 'sku']
    const searchQuery = new QueryBuilders(ProductModel.find().populate('category').populate('reviews'), query).search(searchAbleFields).filter().pagination()
    const result = await searchQuery.QueryModel;
    return result;
};

const getProductById = async (id: string) => {
    const product = await ProductModel.findById(id).populate('category');
    if (!product) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
    return product;
};



const updateProduct = async (id: string, payload: Partial<TProduct> & { imageUpdates?: { index: number, newImage: string }[] }) => {
    const product = await ProductModel.findById(id);
    if (!product) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');

    if (payload.imageUpdates && Array.isArray(payload.imageUpdates)) {
        for (const { index, newImage } of payload.imageUpdates) {

            if (product?.images?.[index]) {
                product.images[index] = newImage
            }
        }
    }

    const { imageUpdates, ...restPayload } = payload
    const update = await ProductModel.findByIdAndUpdate({ _id: id }, { ...restPayload, images: product.images }, { new: true })

    return update;
}

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
