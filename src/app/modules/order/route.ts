import { Router } from "express";
import { orderController } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";

const router = Router();

router.post("/create-order", orderController.createOrderController);
router.get("/", orderController.getAllOrdersController);
router.get("/:id", orderController.getOrderByIdController);
router.get("/user-order/:userId", orderController.getOrderByUserIdController);
router.patch("/:id/status", orderController.updateOrderStatusController);
router.delete("/:id", orderController.deleteOrderController);

export const orderRoutes = router;
