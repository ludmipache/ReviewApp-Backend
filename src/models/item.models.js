import mongoose from "mongoose";
import { ITEM_TYPES_LIST } from "../constants/ItemType.constants.js";

const itemSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ITEM_TYPES_LIST,
        required: true
    },
    descripcion: {
        type: String,
        required: false,
        default: ''
    },
    año: {
        type: Number,
        required: false
    },
    autor_o_director: {
        type: String,
        required: false,
        default: ''
    },
    imagen_url: {
        type: String,
        required: false,
        default: ''
    },
    fecha_creacion: {
        type: Date,
        required: true,
        default: Date.now
    },
    activo: {
        type: Boolean,
        required: true,
        default: true
    }
})

export const ITEM_COLLECTION_NAME = "Item"
const Item = mongoose.model(ITEM_COLLECTION_NAME, itemSchema);
export default Item