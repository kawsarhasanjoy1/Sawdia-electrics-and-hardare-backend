import express from "express";
import { OrderController } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  OrderController.getOrder
);
router.get("/my-order", auth(USER_ROLE.user), OrderController.getUserOrder);
router.get(
  "/stats",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  OrderController.getStats
);
router.get(
  "/monthly-sales",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  OrderController.getMonthlySale
);
router.get("/user-stats", auth(USER_ROLE.user), OrderController.getUserStats);
router.get(
  "/user-yearly-buy",
  auth(USER_ROLE.user),
  OrderController.getUserYearlyBuy
);
router.patch(
  "/up-status/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OrderController.updateOrderStatus
);

export const orderRoutes = router;
