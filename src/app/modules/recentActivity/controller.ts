// backend/modules/activity/activity.controller.ts
import { Request, Response } from "express";
import { ActivityService } from "./services";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Create a new activity
export const createActivityController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId; // assuming auth middleware sets req.user

    const activity = await ActivityService.createActivity(userId);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Activity created successfully",
      data: activity,
    });
  }
);

// Get recent activities
export const getRecentActivitiesController = catchAsync(
  async (req: Request, res: Response) => {
    const activities = await ActivityService.getRecentActivities();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Recent activities fetched successfully",
      data: activities,
    });
  }
);
