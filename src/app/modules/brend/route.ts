import express from "express";
import { BrandControllers } from "./controller";
import { USER_ROLE } from "../../constance/global";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/create-brand",auth(USER_ROLE.admin,USER_ROLE.superAdmin), BrandControllers.createBrandController);
router.get("/", BrandControllers.getAllBrandsController);
router.get("/:id", BrandControllers.getBrandByIdController);
router.patch("/:id", BrandControllers.updateBrandController);
router.delete("/:id", BrandControllers.softDeleteBrandController);
router.delete("/restore/:id", BrandControllers.restoreBrandController);

export const brandRouter = router;
