import { NextFunction, Request, Response } from "express";
import AppError from "../error/handleAppError";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/createToken";
import config from "../config/config";
import { UserModel } from "../modules/user/model";
import { JwtPayload } from "jsonwebtoken";
import { TUserRole } from "../constance/global";
import { catchAsync } from "../utils/catchAsync";

const auth = (...roles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "unauthorized user");
    }
    let decoded;

    try {
      decoded = verifyToken(token, config.jwt_access_secret as string);
    } catch (err) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "unauthorized user");
    }

    const { email, userId, role } = decoded as JwtPayload;
    const user = await UserModel.isUserExistsByEmail(email);
    if (!user)
      throw new AppError(StatusCodes.UNAUTHORIZED, "unauthorized user");
    if (roles && !roles.includes(role)) {
      throw new AppError(StatusCodes.FORBIDDEN, "forbidden user");
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
