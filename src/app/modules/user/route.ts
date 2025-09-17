import { Router } from "express";
import { userController } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";

const router = Router();

router.post("/register", userController.createUser);
router.get("/", userController.getUsers);
router.patch(
  "/status/:userId",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.upStatus
);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/restore/:id", userController.restoreUser);



export const userRoutes = router;
