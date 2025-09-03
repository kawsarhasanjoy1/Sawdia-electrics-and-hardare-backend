import { Router } from 'express';
import { ParentCategoryControllers } from './controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../../constance/global';


const router = Router();

router.post('/create-parent-category',auth(USER_ROLE.admin,USER_ROLE.superadmin), ParentCategoryControllers.createParentCategoryController); // Only admin/superadmin
router.get('/', ParentCategoryControllers.getAllParentCategoriesController);
router.get('/:id', ParentCategoryControllers.getParentCategoryByIdController);
router.patch('/:id',auth(USER_ROLE.admin,USER_ROLE.superadmin), ParentCategoryControllers.updateParentCategoryController); // Only admin/superadmin
router.delete('/:id',auth(USER_ROLE.admin,USER_ROLE.superadmin), ParentCategoryControllers.deleteParentCategoryController); // Only admin/superadmin
router.delete('/restore/:id',auth(USER_ROLE.admin,USER_ROLE.superadmin), ParentCategoryControllers.restoreParentCategory); // Only admin/superadmin

export const parentCategoryRouter = router