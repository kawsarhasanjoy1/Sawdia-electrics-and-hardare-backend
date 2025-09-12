// modules/favourite/controller.ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { FavouriteService } from "./services";

const toggleFavourite = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  const { productId } = req.body;
  const result = await FavouriteService.toggleFavourite(userId, productId);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: result?.message,
    data: result?.data,
  });
});

const getFavourites = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  const result = await FavouriteService.getFavourites(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Favourites fetched successfully",
    data: result,
  });
});

export const FavouriteController = {
  toggleFavourite,
  getFavourites,
};
