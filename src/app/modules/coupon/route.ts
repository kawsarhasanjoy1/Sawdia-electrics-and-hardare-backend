import express from "express";
import { couponController } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";

const router = express.Router();

router.post("/create-coupon",auth(USER_ROLE.admin,USER_ROLE.superadmin), couponController.createCoupon);
router.get("/", couponController.getCoupons);
router.patch("/:id",auth(USER_ROLE.admin,USER_ROLE.superadmin), couponController.updateCoupon);
router.delete("/:id", auth(USER_ROLE.admin,USER_ROLE.superadmin),couponController.deleteCoupon);
router.post("/apply", couponController.applyCoupon);

export const CouponRoutes = router;
