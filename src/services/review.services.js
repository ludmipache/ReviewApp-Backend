import reviewRepository from '../repositories/review.repository.js';
import itemService from './item.services.js';
import ServerError from '../helpers/ServerErrors.js';

class ReviewService {
    async getAll(){
        return await reviewRepository.getAll()
    }

    async getById(review_id){
        const review = await reviewRepository.getById(review_id)
        if(!review || !review.activo){
            throw new ServerError('Reseña no encontrada', 404)
        }
        return review
    }

    async getByItemId(item_id){
        await itemService.getById(item_id)
        return await reviewRepository.getByItemId(item_id)
    }

    async getByUserId(user_id){
        return await reviewRepository.getByUserId(user_id)
    }

    async create(user_id, { fk_item_id, rating, comentario }){
        if(!fk_item_id){
            throw new ServerError('Debes indicar el item a reseñar', 400)
        }

        await itemService.getById(fk_item_id)

        if(rating === undefined || rating === null){
            throw new ServerError('El rating es obligatorio', 400)
        }

        const rating_num = Number(rating)
        if(Number.isNaN(rating_num) || rating_num < 1 || rating_num > 5){
            throw new ServerError('El rating debe ser un numero entre 1 y 5', 400)
        }

        return await reviewRepository.create({
            fk_item_id,
            fk_user_id: user_id,
            rating: rating_num,
            comentario: comentario || ''
        })
    }

    async updateById(review_id, user_id, { rating, comentario }){
        const review = await this.getById(review_id)

        if(review.fk_user_id._id.toString() !== user_id.toString() && review.fk_user_id.toString() !== user_id.toString()){
            throw new ServerError('No tenes permiso para editar esta reseña', 403)
        }

        const updated_info = {}

        if(rating !== undefined){
            const rating_num = Number(rating)
            if(Number.isNaN(rating_num) || rating_num < 1 || rating_num > 5){
                throw new ServerError('El rating debe ser un numero entre 1 y 5', 400)
            }
            updated_info.rating = rating_num
        }

        if(comentario !== undefined) updated_info.comentario = comentario

        return await reviewRepository.updateById(review_id, updated_info)
    }

    async deleteById(review_id, user_id){
        const review = await this.getById(review_id)

        const owner_id = review.fk_user_id._id ? review.fk_user_id._id.toString() : review.fk_user_id.toString()
        if(owner_id !== user_id.toString()){
            throw new ServerError('No tenes permiso para eliminar esta reseña', 403)
        }

        return await reviewRepository.softDeleteById(review_id)
    }
}

const reviewService = new ReviewService()
export default reviewService