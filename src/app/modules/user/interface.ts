import { Model, Types } from "mongoose";
import { UserRole } from "../../constance/global";

export interface TUser {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  avatar?: string;
  isDeleted: boolean;
  isStatus: "isActive" | "Blocked";
  isOnline: boolean;
  lastSeen: Date;
}

export interface TUserModel extends Model<TUser> {
  isUserExistsByEmail: (email: string) => Promise<TUser | null>;
}
export interface TUserModel extends Model<TUser> {
  isPasswordMatched: (
    password: string,
    hashedPassword: string
  ) => Promise<boolean>;
}
