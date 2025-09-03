import { Router } from 'express';
import { ReviewController } from './controller';

const router = Router();


router.post('/create-product', ReviewController.createReviewController);
router.get('/', ReviewController.getReviewsByProductController);
router.patch('/:id', ReviewController.updateReviewController);
router.delete('/:id', ReviewController.deleteReviewController);

export const reviewRouter = router;
