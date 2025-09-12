import { Router } from 'express';
import { ParentCategoryControllers } from './controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../../constance/global';


const router = Router();

router.post('/create-parent-category',auth(USER_ROLE.admin,USER_ROLE.superAdmin), ParentCategoryControllers.createParentCategoryController); // Only admin/superAdmin
router.get('/', ParentCategoryControllers.getAllParentCategoriesController);
router.get('/:id', ParentCategoryControllers.getParentCategoryByIdController);
router.patch('/:id',auth(USER_ROLE.admin,USER_ROLE.superAdmin), ParentCategoryControllers.updateParentCategoryController); // Only admin/superAdmin
router.delete('/:id',auth(USER_ROLE.admin,USER_ROLE.superAdmin), ParentCategoryControllers.deleteParentCategoryController); // Only admin/superAdmin
router.delete('/restore/:id',auth(USER_ROLE.admin,USER_ROLE.superAdmin), ParentCategoryControllers.restoreParentCategory); // Only admin/superAdmin

export const parentCategoryRouter = router