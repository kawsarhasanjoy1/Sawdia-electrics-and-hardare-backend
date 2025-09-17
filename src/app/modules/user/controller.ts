import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./services";
import sendResponse from "../../utils/sendResponse";
import { countries } from "./constance";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as any;

  const existing = await userService.findUserByEmail(payload.email);
  if (existing) {
    throw new Error("Email already exists");
  }

  if (payload.country) {
    const ok = countries.find(
      (c) => c.code === payload.country || c.name === payload.country
    );
    if (!ok) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid country",
        data: null,
      });
    }
  }

  const user = await userService.createUser(payload);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created",
    data: user,
  });
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const users = await userService.findUsers(query);
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    data: users,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.findUserById(id);
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
      data: null,
    });
  }
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body as any;

  if (payload.country) {
    const ok = countries.find(
      (c) => c.code === payload.country || c.name === payload.country
    );
    if (!ok) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid country",
        data: null,
      });
    }
  }

  const updated = await userService.updateUserById(id, payload);
  if (!updated) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
      data: null,
    });
  }
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    data: updated,
  });
});

const upStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const status = req.body;
  console.log(userId, status);
  const result = await userService.updateStatus({ id: userId, status });
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const deleted = await userService.deleteUser(id);

  return sendResponse(res, {
    message: "User deleted successful",
    statusCode: 200,
    success: true,
    data: deleted,
  });
});
const restoreUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await userService.restoreUser(id);

  return sendResponse(res, {
    message: "User restored successful",
    statusCode: 200,
    success: true,
    data: deleted,
  });
});

export const userController = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  upStatus,
  deleteUser,
  restoreUser,
};
