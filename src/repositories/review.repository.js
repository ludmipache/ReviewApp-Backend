import Review from '../models/review.models.js';

class ReviewRepository {
    async getAll(){
        return await Review.find({ activo: true })
            .populate({ path: 'fk_item_id', select: 'titulo tipo imagen_url año', match: { activo: true } })
            .populate({ path: 'fk_user_id', select: 'nombre', match: { activo: true } });
    }

    async getById(review_id){
        return await Review.findById(review_id)
            .populate({ path: 'fk_item_id', select: 'titulo tipo imagen_url año' })
            .populate({ path: 'fk_user_id', select: 'nombre' });
    }

    async getByItemId(item_id){
        return await Review.find({ fk_item_id: item_id, activo: true })
            .populate({ path: 'fk_user_id', select: 'nombre' });
    }

    async getByUserId(user_id){
        return await Review.find({ fk_user_id: user_id, activo: true })
            .populate({ path: 'fk_item_id', select: 'titulo tipo imagen_url año' });
    }

    async create(data){
        return await Review.create(data);
    }

    async updateById(review_id, update_data){
        return await Review.findByIdAndUpdate(review_id, update_data, { new: true });
    }

    async softDeleteById(review_id){
        return await this.updateById(review_id, { activo: false });
    }
}

const reviewRepository = new ReviewRepository();
export default reviewRepository;