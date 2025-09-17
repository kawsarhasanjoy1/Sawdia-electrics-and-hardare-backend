import { StatusCodes } from "http-status-codes";
import AppError from "../../error/handleAppError";
import { TUser } from "./interface";
import { UserModel } from "./model";
import { Restore, softDelete } from "../../helpers/softDelete";
import QueryBuilders from "../../builders/queryBuilders";

const createUser = async (payload: Partial<TUser>): Promise<TUser> => {
  const doc = new UserModel(payload);
  return doc.save();
};

const findUsers = async (query: Record<string, any>) => {
  const userQuery = new QueryBuilders(
    UserModel.find().select("-password"),
    query
  )
    .search(["name email"])
    .filter()
    .pagination()
    .sort();
  const result = await userQuery.QueryModel;
  return result;
};

const findUserById = async (id: string): Promise<TUser | null> => {
  return UserModel.findById(id).select("-password").exec();
};

const findUserByEmail = async (email: string): Promise<TUser | null> => {
  return UserModel.findOne({ email }).exec();
};

const updateUserById = async (
  id: string,
  update: Partial<TUser>
): Promise<TUser | null> => {
  return UserModel.findByIdAndUpdate(id, update, { new: true })
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
};
