import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import itemController from '../controllers/item.controller.js';
import validateBody from '../middlewares/validate.middleware.js';

const itemRouter = express.Router();

itemRouter.get('/', itemController.getAll);
itemRouter.get('/:item_id', itemController.getById);

itemRouter.post(
    '/',
    authMiddleware,
    validateBody({
        titulo: { required: true, type: 'string' },
        tipo: { required: true, type: 'string' }
    }),
    itemController.create
);

itemRouter.put(
    '/:item_id',
    authMiddleware,
    itemController.updateById
);

itemRouter.delete(
    '/:item_id',
    authMiddleware,
    itemController.deleteById
);

export default itemRouter;