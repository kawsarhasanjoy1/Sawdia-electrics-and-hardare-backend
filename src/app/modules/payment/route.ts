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
  "/stats",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  paymentController.getStats
);
router.get(
  "/weekly-sales",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  paymentController.getWeeklySales
);

export const paymentRouter = router;
