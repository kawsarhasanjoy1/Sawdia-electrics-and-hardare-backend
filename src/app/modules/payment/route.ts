import { Router } from "express";
import { paymentController } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";

const router = Router()

router.post('/order-payment', paymentController.createPaymenController);
router.post('/payment-success/:transectionId', paymentController.paymentSuccess);
router.post('/payment-fail/:transectionId', paymentController.paymentFail);
router.post('/payment-cancel/:transectionId', paymentController.paymentCancel);
router.patch('/update-status/:transectionId', auth(USER_ROLE.admin, USER_ROLE.superAdmin), paymentController.updateOrderStatus)


export const paymentRouter = router