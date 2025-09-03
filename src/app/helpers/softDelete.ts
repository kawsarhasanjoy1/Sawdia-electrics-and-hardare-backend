import { Model, Types } from "mongoose";

export const softDelete = async (model: Model<any>, id: Types.ObjectId) => {
    const result = await model.findByIdAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
    if (!result) throw new Error(`${model.modelName} not found`);
    return result
}

export const Restore = async (model: Model<any>, id: Types.ObjectId) => {
    const result = await model.findByIdAndUpdate({ _id: id }, { isDeleted: false }, { new: true })
    if (!result) throw new Error(`${model.modelName} not found`);
    return result
}
