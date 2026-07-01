import reviewService from '../services/review.services.js';
import ServerError from '../helpers/ServerErrors.js';

class ReviewController {
    async getAll(request, response) {
        try {
            const reviews = await reviewService.getAll();

            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'Reseñas obtenidas',
                data: { reviews }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                });
            } else {
                console.error('Error critico:', error);
                return response.status(500).json({
                    message: 'Error interno del servidor',
                    ok: false,
                    status: 500
                });
            }
        }
    }

    async getById(request, response) {
        try {
            const { review_id } = request.params;

            const review = await reviewService.getById(review_id);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'Reseña obtenida',
                data: { review }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                });
            } else {
                console.error('Error critico:', error);
                return response.status(500).json({
                    message: 'Error interno del servidor',
                    ok: false,
                    status: 500
                });
            }
        }
    }

    async getByItemId(request, response) {
        try {
            const { item_id } = request.params;

            const reviews = await reviewService.getByItemId(item_id);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'Reseñas del item obtenidas',
                data: { reviews }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                });
            } else {
                console.error('Error critico:', error);
                return response.status(500).json({
                    message: 'Error interno del servidor',
                    ok: false,
                    status: 500
                });
            }
        }
    }

    async getMyReviews(request, response) {
        try {
            const user_id = request.user.id;

            const reviews = await reviewService.getByUserId(user_id);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'Tus reseñas fueron obtenidas',
                data: { reviews }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                });
            } else {
                console.error('Error critico:', error);
                return response.status(500).json({
                    message: 'Error interno del servidor',
                    ok: false,
                    status: 500
                });
            }
        }
    }

    async create(request, response) {
        try {
            const user_id = request.user.id;

            const new_review = await reviewService.create(user_id, request.body);

            return response.status(201).json({
                ok: true,
                status: 201,
                message: 'Reseña creada con exito',
                data: { review: new_review }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                });
            } else {
                console.error('Error critico:', error);
                return response.status(500).json({
                    message: 'Error interno del servidor',
                    ok: false,
                    status: 500
                });
            }
        }
    }

    async updateById(request, response) {
        try {
            const { review_id } = request.params;
            const user_id = request.user.id;

            const updated_review = await reviewService.updateById(review_id, user_id, request.body);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'Reseña actualizada con exito',
                data: { review: updated_review }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                });
            } else {
                console.error('Error critico:', error);
                return response.status(500).json({
                    message: 'Error interno del servidor',
                    ok: false,
                    status: 500
                });
            }
        }
    }

    async deleteById(request, response) {
        try {
            const { review_id } = request.params;
            const user_id = request.user.id;

            const deleted_review = await reviewService.deleteById(review_id, user_id);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'Reseña eliminada con exito',
                data: { review: deleted_review }
            });
        } catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                });
            } else {
                console.error('Error critico:', error);
                return response.status(500).json({
                    message: 'Error interno del servidor',
                    ok: false,
                    status: 500
                });
            }
        }
    }
}

const reviewController = new ReviewController();
export default reviewController;