import { model, Schema, Types } from "mongoose";
import { TUser, TUserModel } from "./interface";
import bcrypt from "bcrypt";
import config from "../../config/config";
import { StatusCodes } from "http-status-codes";
import AppError from "../../error/handleAppError";

const UserSchema = new Schema<TUser, TUserModel>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin", "sales"],
      default: "user",
    },

    avatar: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    isStatus: {
      type: String,
      enum: ["isActive", "Blocked"],
      default: "isActive",
    },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.salt_rounds)
    );
    next();
  } else {
    throw new Error("Password is required");
  }
});

UserSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

UserSchema.statics.isUserExistsByEmail = async function (email: string) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (user.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, "User is deleted");
  }
  if (user.isStatus === "Blocked") {
    throw new AppError(StatusCodes.FORBIDDEN, "User is blocked");
  }
  return user;
};
UserSchema.statics.isPasswordMatched = async function (
  password: string,
  hashedPassword: string
) {
  return await bcrypt.compare(password, hashedPassword);
};

export const UserModel = model<TUser, TUserModel>("User", UserSchema);
