import { Router } from 'express';
import { AuthControllers } from './controller';
import { USER_ROLE } from '../../constance/global';
import auth from '../../middleware/auth';

const router = Router();

router.post('/login', AuthControllers.loginUser);
router.post('/logout', AuthControllers.logout);
router.post('/refresh-token', AuthControllers.createAccessToken)
router.patch('/change-password', auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.sales), AuthControllers.changePassword)
router.patch('/forget-password', AuthControllers.forgetPassword)
router.patch('/reset-password',  AuthControllers.resetPassword)



export const authRoutes = router