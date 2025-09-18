import { Router } from "express";
import { paymentController } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";

const router = Router();

router.post(
  "/order-payment",
  auth(USER_ROLE.user),
  paymentController.createPaymenController
);
router.post(
  "/payment-success/:transectionId",
  paymentController.paymentSuccess
);
router.post("/payment-fail/:transectionId", paymentController.paymentFail);
router.post("/payment-cancel/:transectionId", paymentController.paymentCancel);
router.patch(
  "/update-status/:transectionId",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  paymentController.updateOrderStatus
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  paymentController.getPayments
);
router.get(
  "/my-order",
  auth(USER_ROLE.user),
  paymentController.getUserPayments
);
router.delete(
  "/delete-my-order/:id",
  auth(USER_ROLE.user),
  paymentController.userOrderSoftDelete
);
router.delete(
  "/restored-my-order/:id",
  auth(USER_ROLE.user),
  paymentController.userOrderRestored
);
router.get(
  "/stats",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  paymentController.getStats
);
router.get(
  "/monthly-sales",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  paymentController.getMonthlySales
);
router.get(
  "/user-yearly-buy",
  auth(USER_ROLE.user),
  paymentController.getUserYearlyBuy
);

router.get("/user-stats", auth(USER_ROLE.user), paymentController.getUserStats);

export const paymentRouter = router;
