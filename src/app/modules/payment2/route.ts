import { Router } from "express";
import { paymentController2 } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";

const router = Router();

router.post("/init", auth(USER_ROLE.user), paymentController2.createPayment);
router.post("/success", paymentController2.paymentSuccess);
router.post("/fail", paymentController2.paymentFail);
router.post("/cancel", paymentController2.paymentCancel);
router.post("/ipn", paymentController2.paymentIpn);
router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  paymentController2.getPayment
);
router.get("/user-payment", auth(USER_ROLE.user), paymentController2.getUserPayment);
router.patch("/up-status/:id", paymentController2.updatePaymentStatus);
export const PaymentRoute = router;
