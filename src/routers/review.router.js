import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import reviewController from '../controllers/review.controller.js';
import validateBody from '../middlewares/validate.middleware.js';

const reviewRouter = express.Router();

reviewRouter.get('/', reviewController.getAll);
reviewRouter.get('/item/:item_id', reviewController.getByItemId);

reviewRouter.get('/me', authMiddleware, reviewController.getMyReviews);
reviewRouter.get('/:review_id', reviewController.getById);

reviewRouter.post(
    '/',
    authMiddleware,
    validateBody({
        fk_item_id: { required: true, type: 'string' },
        rating: { required: true, type: 'number' }
    }),
    reviewController.create
);

reviewRouter.put('/:review_id', authMiddleware, reviewController.updateById);
reviewRouter.delete('/:review_id', authMiddleware, reviewController.deleteById);

export default reviewRouter;