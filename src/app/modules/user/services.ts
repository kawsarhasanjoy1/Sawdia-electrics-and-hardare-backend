import { StatusCodes } from "http-status-codes";
import AppError from "../../error/handleAppError";
import { TUser } from "./interface";
import { UserModel } from "./model";
import { Restore, softDelete } from "../../helpers/softDelete";
import QueryBuilders from "../../builders/queryBuilders";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary.ts";
import { Types } from "mongoose";

const createUser = async (payload: Partial<TUser>): Promise<TUser> => {
  const doc = new UserModel(payload);
  return doc.save();
};
const createAdmin = async (
  userId: Types.ObjectId,
  payload: Partial<TUser>,
  avatar: any
) => {
  const cloudinary: any = await sendImageToCloudinary(
    avatar?.path,
    avatar?.fieldname
  );
  payload.avatar = cloudinary?.secure_url;
  const isExistSuperAdmin = await UserModel.findOne({
    _id: userId,
    role: "superAdmin",
  });
  if (payload?.role !== "admin") {
    throw new AppError(
      StatusCodes.CONFLICT,
      "This route only for create admin"
    );
  }
  if (!isExistSuperAdmin)
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  const result = await UserModel.create(payload);
};

const findUsers = async (query: Record<string, any>) => {
  const searchableField = ["name", "email"];
  const userQuery = new QueryBuilders(
    UserModel.find().select("-password"),
    query
  )
    .search(searchableField)
    .filter()
    .pagination()
    .sort();
  const data = await userQuery.QueryModel;
  const meta = await userQuery.countTotal();
  return { data, meta };
};

const getMe = async (userId: string) => {
  const user = await UserModel.findOne({ _id: userId });
  if (!user)
    throw new AppError(StatusCodes.NOT_FOUND, "this user is not found");
  await UserModel.isUserExistsByEmail(user?.email);

  return user;
};

const findUserById = async (id: string): Promise<TUser | null> => {
  return UserModel.findById(id).select("-password").exec();
};

const findUserByEmail = async (email: string): Promise<TUser | null> => {
  return UserModel.findOne({ email }).exec();
};

const updateUserById = async (
  id: string,
  avatar: any,
  payload: Partial<TUser>
): Promise<TUser | null> => {
  const cloudinary = (await sendImageToCloudinary(
    avatar?.path,
    avatar?.fieldname
  )) as any;

  payload.avatar = cloudinary?.secure_url;
  return UserModel.findByIdAndUpdate(id, { ...payload }, { new: true })
    .select("-password")
    .exec();
};

// const deleteUserById = async (id: string): Promise<TUser | null> => {
//   return UserModel.findByIdAndDelete(id).select("-password").exec();
// };

const updateStatus = async ({ id, status }: any) => {
  const user = await UserModel.findOne({ _id: id });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (user?.role == "superAdmin") {
    throw new AppError(StatusCodes.CONFLICT, "cannot block supperAdmin");
  }

  const result = await UserModel.findByIdAndUpdate(
    { _id: id },
    { isStatus: status?.status },
    { new: true }
  );
  return result;
};

const deleteUser = async (id: string) => {
  const result = await softDelete(UserModel, id as any);
  return result;
};

const restoreUser = async (id: string) => {
  const result = await Restore(UserModel, id as any);
  return result;
};

export const userService = {
  createUser,
  findUsers,
  findUserById,
  findUserByEmail,
  updateUserById,
  updateStatus,
  deleteUser,
  restoreUser,
  getMe,
  createAdmin,
};
