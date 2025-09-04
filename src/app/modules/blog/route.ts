import express from "express";
import { blogController } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";
const router = express.Router();

// Admin routes
router.post("/", auth(USER_ROLE.admin, USER_ROLE.superadmin), blogController.createBlog);
router.put("/:id", auth(USER_ROLE.admin, USER_ROLE.superadmin), blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

// Public routes
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlog);

export default router;
