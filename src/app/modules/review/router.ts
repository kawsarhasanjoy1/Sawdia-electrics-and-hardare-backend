import { Router } from 'express';
import { ReviewController } from './controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../../constance/global';

const router = Router();


router.post('/create-product', auth(USER_ROLE.user), ReviewController.createReviewController);
router.get('/', ReviewController.getReviewsByProductController);
router.patch('/:id', auth(USER_ROLE.user), ReviewController.updateReviewController);
router.delete('/:id', ReviewController.deleteReviewController);

export const reviewRouter = router;
