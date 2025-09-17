import { Router } from "express";
import { createActivityController, getRecentActivitiesController } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";

const router = Router();

router.post("/", auth(USER_ROLE.admin,USER_ROLE.user,USER_ROLE.superAdmin,USER_ROLE.sales), createActivityController);
router.get("/", auth(USER_ROLE.admin,USER_ROLE.superAdmin), getRecentActivitiesController);

export const activityRouter = router
