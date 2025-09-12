import { Router } from "express";
import { CategoryControllers } from "./controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../constance/global";

const router = Router()

router.post('/create-category',auth(USER_ROLE.admin,USER_ROLE.superAdmin), CategoryControllers.createCategoryController)
router.get('/', CategoryControllers.getAllCategoriesController)
router.get('/:id', CategoryControllers.getCategoryByIdController)
router.put('/:id',auth(USER_ROLE.admin,USER_ROLE.superAdmin), CategoryControllers.updateCategoryController)
router.delete('/:id',auth(USER_ROLE.admin,USER_ROLE.superAdmin), CategoryControllers.deleteCategoryController)
router.delete('/restore/:id',auth(USER_ROLE.admin,USER_ROLE.superAdmin), CategoryControllers.restoreCategoryController)


export const categoryRouter = router;