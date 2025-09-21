import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";
import { productController } from "./controller";
import { upload } from "../../utils/sendImageToCloudinary.ts";
import parseData from "../../middleware/parseData";

const router = Router();

// Only admin can create, update, delete
router.post(
  "/create-product",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.array("files", 5),
  parseData,
  productController.createProductController
);
router.put(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.array("files", 5),
  // parseData,
  productController.updateProductController
);
router.patch(
  "/save/:id",
  auth(USER_ROLE.user),
  productController.updateProductSaveController
);
router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  productController.deleteProductController
);
router.delete(
  "/restore/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  productController.restoreProductController
);

// Public
router.get("/", productController.getAllProductsController);
router.get("/:id", productController.getProductByIdController);

export const productRouter = router;
