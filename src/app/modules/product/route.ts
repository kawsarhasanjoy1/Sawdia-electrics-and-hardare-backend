import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../../constance/global';
import { productController } from './controller';


const router = Router();

// Only admin can create, update, delete
router.post('/create-product', auth(USER_ROLE.admin, USER_ROLE.superadmin), productController.createProductController);
router.put('/:id', auth(USER_ROLE.admin, USER_ROLE.superadmin), productController.updateProductController);
router.delete('/:id', auth(USER_ROLE.admin, USER_ROLE.superadmin), productController.deleteProductController);
router.delete('restore/:id', auth(USER_ROLE.admin, USER_ROLE.superadmin), productController.restoreProductController);

// Public
router.get('/', productController.getAllProductsController);
router.get('/:id', productController.getProductByIdController);

export const productRouter = router;
