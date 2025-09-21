import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./services";
import sendResponse from "../../utils/sendResponse";
import config from "../../config/config";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;
 const isProd = config.node_env === "production"
 res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: isProd,          
  sameSite: isProd ? "none" : "lax", 
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: "/api/v1/auth/refresh-token",          
});


  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User is logged in successfully!",
    data: {
      accessToken,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePassword(req.user, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password changed successfully!",
    data: result,
  });
});

const createAccessToken = catchAsync(async (req, res) => {
  const result = await AuthServices.createAccessToken(req.cookies.refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Token created successfully!",
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
  const token = req.headers.authorization;
  const result = await AuthServices.resetPassword(req.body, token as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  createAccessToken,
  forgetPassword,
  resetPassword,
};
