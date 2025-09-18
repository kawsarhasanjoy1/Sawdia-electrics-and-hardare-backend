import { Router } from "express";
import { ReviewController } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";

const router = Router();

router.post(
  "/create-review",
  auth(USER_ROLE.user),
  ReviewController.createReviewController
);
router.get(
  "/reviews",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ReviewController.getReviewsByProductController
);
router.get("/", ReviewController.getReviewsByProductController);
router.get(
  "/user-review",
  auth(USER_ROLE.user),
  ReviewController.getUserReviewController
);
router.patch(
  "/:id",
  auth(USER_ROLE.user),
  ReviewController.updateReviewController
);
router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ReviewController.deleteReviewController
);

export const reviewRouter = router;
