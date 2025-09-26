// middleware/auth.ts
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../error/handleAppError";
import { verifyToken } from "../utils/createToken";
import config from "../config/config";
import { UserModel } from "../modules/user/model";
import { JwtPayload } from "jsonwebtoken";
import { TUserRole } from "../constance/global";
import { catchAsync } from "../utils/catchAsync";

const auth = (...roles: TUserRole[]) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) throw new AppError(StatusCodes.UNAUTHORIZED, "unauthorized user");
    let decoded: JwtPayload;
    try {
      decoded = verifyToken(token, config.jwt_access_secret as string) as JwtPayload;
    } catch {
      throw new AppError(StatusCodes.UNAUTHORIZED, "unauthorized user");
    }

    const user = await UserModel.isUserExistsByEmail(decoded.email);
    if (!user) throw new AppError(StatusCodes.UNAUTHORIZED, "unauthorized user");
    if (roles.length && !roles.includes(decoded.role as TUserRole)) {
      throw new AppError(StatusCodes.FORBIDDEN, "forbidden user");
    }
    (req as any).user = decoded;
    next();
  });

export default auth;
