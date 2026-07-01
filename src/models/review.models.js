import mongoose from "mongoose";
import { ITEM_COLLECTION_NAME } from "./item.models.js";
import { USER_COLLECTION_NAME } from "./user.models.js";

const reviewSchema = new mongoose.Schema({
    fk_item_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: ITEM_COLLECTION_NAME
    },
    fk_user_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: USER_COLLECTION_NAME
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comentario: {
        type: String,
        required: false,
        default: ''
    },
    fecha_creacion: {
        type: Date,
        default: Date.now,
        required: true
    },
    activo: {
        type: Boolean,
        required: true,
        default: true
    }
})

export const REVIEW_COLLECTION_NAME = 'Review'
const Review = mongoose.model(REVIEW_COLLECTION_NAME, reviewSchema)

export default Review