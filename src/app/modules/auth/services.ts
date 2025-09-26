// src/modules/auth/services.ts
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../user/model";
import { TLoginUser } from "./interface";
import { createToken, verifyToken } from "../../utils/createToken";
import config from "../../config/config";
import { JwtPayload } from "jsonwebtoken";
import { TUser } from "../user/interface";
import AppError from "../../error/handleAppError";
import { sendEmail } from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
  const user = (await UserModel.isUserExistsByEmail(payload?.email)) as any;
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  const passOk = await UserModel.isPasswordMatched(payload?.password, user?.password as string);
  if (!passOk) throw new AppError(StatusCodes.FORBIDDEN, "Password do not matched");

  const jwtPayload = { userId: user?._id, email: user?.email, role: user?.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string | number
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string | number
  );

  return { accessToken, refreshToken };
};

const createAccessToken = async (refreshTokenFromCookie?: string) => {
  if (!refreshTokenFromCookie) throw new AppError(StatusCodes.FORBIDDEN, "No refresh token");

  let decoded: JwtPayload;
  try {
    decoded = verifyToken(refreshTokenFromCookie, config.jwt_refresh_secret as string) as JwtPayload;
  } catch {
    throw new AppError(StatusCodes.FORBIDDEN, "Invalid Refresh Token");
  }

  const { email } = decoded;
  const user = (await UserModel.isUserExistsByEmail(email)) as TUser | any;
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  const jwtPayload = { userId: user?._id, email: user?.email, role: user?.role };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { accessToken };
};

const changePassword = async (userData: any, payload: { oldPassword: string; newPassword: string }) => {
  const user = (await UserModel.isUserExistsByEmail(userData?.email)) as any;
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  if (payload.oldPassword === payload.newPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "New password must be different from old password");
  }

  const ok = await UserModel.isPasswordMatched(payload?.oldPassword, user?.password as string);
  if (!ok) throw new AppError(StatusCodes.CONFLICT, "Password do not matched");

  const hashedPassword = await bcrypt.hash(payload.newPassword, Number(config.salt_rounds));
  const updated = await UserModel.findOneAndUpdate({ _id: user?._id }, { password: hashedPassword }, { new: true });
  return updated;
};

const forgetPassword = async (email: string) => {
  const user = (await UserModel.isUserExistsByEmail(email)) as TUser | any;
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "This user is not found !");

  const jwtPayload = { userId: user._id, email: user?.email, role: user.role };
  // 5 minutes reset token signed with ACCESS secret (you verify with the same later)
  const resetToken = createToken(jwtPayload, config.jwt_access_secret as string, "5m");

  const resetUILink = `${config.forget_password_link}?id=${user._id}&email=${user.email}&token=${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click this link: ${resetUILink}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name || ""},</p>
        <p>You requested to reset your password. Please click the link below to reset it:</p>
        <a href="${resetUILink}" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>This link will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });

  return { sent: true };
};

const resetPassword = async (
  payload: { newPassword: string; confirmPassword: string },
  authHeaderToken: string
) => {
  if (!authHeaderToken) throw new AppError(StatusCodes.FORBIDDEN, "Invalid Reset Token");

  // Accept both Bearer and raw
  const raw = authHeaderToken.startsWith("Bearer ") ? authHeaderToken.slice(7) : authHeaderToken;

  let decoded: JwtPayload;
  try {
    decoded = verifyToken(raw, config.jwt_access_secret as string) as JwtPayload;
  } catch {
    throw new AppError(StatusCodes.FORBIDDEN, "Invalid Reset Token");
  }

  const { email } = decoded;
  const user = await UserModel.isUserExistsByEmail(email);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  if (payload.newPassword !== payload.confirmPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Passwords do not match");
  }

  const hashed = await bcrypt.hash(payload.newPassword, Number(config.salt_rounds));
  const result = await UserModel.findOneAndUpdate({ email }, { password: hashed }, { new: true });
  return result;
};

export const AuthServices = {
  loginUser,
  createAccessToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
