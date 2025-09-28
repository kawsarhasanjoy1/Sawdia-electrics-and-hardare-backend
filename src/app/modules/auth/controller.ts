// src/modules/auth/controller.ts
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./services";
import sendResponse from "../../utils/sendResponse";
import config from "../../config/config";

// Cookie flags:
// - If frontend is on a different origin and you're on HTTPS, use sameSite:"none", secure:true.
// - For localhost/dev over HTTP, use sameSite:"lax", secure:false.

const isProd = config.node_env === "production";

const cookieOpts = isProd
  ? { httpOnly: true, secure: true, sameSite: "none" as const, path: "/", maxAge: 1000 * 60 * 60 * 24 * 365 }
  : { httpOnly: true, secure: false, sameSite: "lax" as const, path: "/", maxAge: 1000 * 60 * 60 * 24 * 365 };

const loginUser = catchAsync(async (req, res) => {
  const { refreshToken, accessToken } = await AuthServices.loginUser(req.body);
  res.cookie("refreshToken", refreshToken, cookieOpts);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User is logged in successfully!",
    data: { accessToken },
  });
});


const createAccessToken = catchAsync(async (req, res) => {
  const { accessToken } = await AuthServices.createAccessToken(req.cookies.refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Token created successfully!",
    data: { accessToken },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePassword((req as any).user, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password changed successfully!",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgetPassword(req.body.email);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reset password link sent successfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string; 
  const result = await AuthServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});


const logout = catchAsync(async (req, res) => {
  res.clearCookie("refreshToken", {
    path: "/",
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged out",
    data: null,
  });
});

export const AuthControllers = {
  loginUser,
  createAccessToken,
  changePassword,
  forgetPassword,
  resetPassword,
  logout,
};
