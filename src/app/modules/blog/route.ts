import express from "express";
import { blogController } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";
import { upload } from "../../utils/sendImageToCloudinary.ts";
import parseData from "../../middleware/parseData";
const router = express.Router();

// Admin routes
router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single("file"),
  parseData,
  blogController.createBlog
);
router.put(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  blogController.updateBlog
);
router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  blogController.softDeleteBlog
);
router.delete(
  "restore/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  blogController.restoreBlog
);
router.patch(
  "/toggle-publish/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  blogController.togglePublishController
);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);

export const blogRoutes = router;
