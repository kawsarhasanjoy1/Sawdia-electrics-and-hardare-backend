import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../user/model';
import { TLoginUser } from './interface';
import { createToken, verifyToken } from '../../utils/createToken';
import config from '../../config/config';
import { JwtPayload } from 'jsonwebtoken';
import { TUser } from '../user/interface';
import AppError from '../../error/handleAppError';
import { sendEmail } from '../../utils/sendEmail';
import { cleanRegex } from 'zod/v4/core/util.cjs';


const loginUser = async (payload: TLoginUser) => {

    const user = await UserModel.isUserExistsByEmail(payload?.email) as any;
    if (!(await UserModel.isPasswordMatched(payload?.password, user?.password as string)))
        throw new AppError(StatusCodes.FORBIDDEN, 'Password do not matched');

    const jwtPayload = {
        userId: user?._id,
        email: user?.email,
        role: user?.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string | number,
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string | number,
    );

    return {
        accessToken,
        refreshToken
    };
};

const createAccessToken = async (token: string) => {
    let decoded;
    try {
        decoded = verifyToken(token, config.jwt_refresh_secret as string);
    } catch (err) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { userId, email, role } = decoded as JwtPayload;
    const user = await UserModel.isUserExistsByEmail(email) as TUser | any;
    const jwtPayload = {
        userId: user?._id,
        email: user?.email,
        role: user?.role,
    } as JwtPayload;
    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);
    return {
        accessToken
    };
}

const changePassword = async (userData: any, payload: { oldPassword: string; newPassword: string }) => {
    const user = await UserModel.isUserExistsByEmail(userData?.email) as any
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    if (payload.oldPassword === payload.newPassword) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'New password must be different from old password');
    }
    if (!(await UserModel.isPasswordMatched(payload?.oldPassword, user?.password as string))) throw new AppError(StatusCodes.FORBIDDEN, 'Password do not matched');
    const hashedPassword = await bcrypt.hash(payload.newPassword, Number(config.salt_rounds));
    const updatePass = await UserModel.findOneAndUpdate({ _id: user?._id }, { password: hashedPassword })
    return updatePass

}


const forgetPassword = async (email: string) => {
    const user = await UserModel.isUserExistsByEmail(email) as TUser | any;

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !');
    }


    const jwtPayload = {
        userId: user._id,
        email: user?.email,
        role: user.role,
    };

    const resetToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        '5m',
    );

    const resetUILink = `${config.forget_password_link}?id=${user._id}&email=${user.email}&token=${resetToken} `;
    await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: `You requested a password reset. Click this link: ${resetUILink}`,
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Please click the link below to reset it:</p>
        <a href="${resetUILink}" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>This link will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
    });
};

const resetPassword = async (payload: { newPassword: string; confirmPassword: string }, token: string) => {
    let decoded;
    try {
        decoded = verifyToken(token, config.jwt_access_secret as string);
    } catch (err) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Invalid Reset Token');
    }
    const { email } = decoded as JwtPayload;
    const user = await UserModel.isUserExistsByEmail(email);
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    if (payload.newPassword !== payload.confirmPassword) throw new AppError(StatusCodes.BAD_REQUEST, 'Passwords do not match');
    const result = await UserModel.findOneAndUpdate({ email }, { password: payload.newPassword })
    return result;
};

export const AuthServices = {
    loginUser,
    createAccessToken,
    changePassword,
    forgetPassword,
    resetPassword
}
