import { Router } from 'express';
import { ReviewController } from './controller';

const router = Router();


router.post('/', ReviewController.createReviewController);
router.get('/product/:productId', ReviewController.getReviewsByProductController);
router.patch('/:id', ReviewController.updateReviewController);
router.delete('/:id', ReviewController.deleteReviewController);

export const reviewRouter = router;
