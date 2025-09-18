import { Router } from "express";
import { userController } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";
import { upload } from "../../utils/sendImageToCloudinary.ts";
import parseData from "../../middleware/parseData";

const router = Router();

router.post("/register", userController.createUser);
router.post(
  "/create-admin",
  upload.single("file"),
  parseData,
  auth(USER_ROLE.superAdmin),
  userController.createAdmin
);
router.get("/", userController.getUsers);
router.patch(
  "/status/:userId",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.upStatus
);
router.get(
  "/get-me",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.getMe
);
router.get("/:id", userController.getUserById);
router.patch(
  "/update-user",
  upload.single("file"),
  parseData,
  auth(USER_ROLE.user, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.updateUser
);
router.delete("/:id", userController.deleteUser);
router.patch("/restore/:id", userController.restoreUser);

export const userRoutes = router;
