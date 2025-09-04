import { Router } from "express";
import { paymentController } from "./controller";

const router = Router()

router.post('/order-payment', paymentController.createPaymenController);
router.post('/payment-success/:transectionId', paymentController.paymentSuccess);
router.post('/payment-fail/:transectionId', paymentController.paymentFail);
router.post('/payment-cancel/:transectionId', paymentController.paymentCancel);



export const paymentRouter = router