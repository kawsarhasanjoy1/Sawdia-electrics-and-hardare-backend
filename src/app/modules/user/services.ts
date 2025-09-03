import { TUser } from './interface';
import { UserModel } from './model';

 const createUser = async (payload: Partial<TUser>): Promise<TUser> => {
    const doc = new UserModel(payload);
    return doc.save();
};

 const findUsers = async (): Promise<TUser[]> => {
    return UserModel.find().select('-password').exec();
};

 const findUserById = async (id: string): Promise<TUser | null> => {
    return UserModel.findById(id).select('-password').exec();
};

 const findUserByEmail = async (email: string): Promise<TUser | null> => {
    return UserModel.findOne({ email }).exec();
};

 const updateUserById = async (id: string, update: Partial<TUser>): Promise<TUser | null> => {
    return UserModel.findByIdAndUpdate(id, update, { new: true }).select('-password').exec();
};

 const deleteUserById = async (id: string): Promise<TUser | null> => {
    return UserModel.findByIdAndDelete(id).select('-password').exec();
};


export const userService = {
    createUser,
    findUsers,
    findUserById,
    findUserByEmail,
    updateUserById,
    deleteUserById
};