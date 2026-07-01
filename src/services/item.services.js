import itemRepository from '../repositories/item.repository.js';
import ServerError from '../helpers/ServerErrors.js';
import { ITEM_TYPES_LIST } from '../constants/ItemType.constants.js';

class ItemService {
    async getAll(tipo){
        const filtros = {}
        if(tipo){
            if(!ITEM_TYPES_LIST.includes(tipo)){
                throw new ServerError(`El tipo debe ser uno de: ${ITEM_TYPES_LIST.join(', ')}`, 400)
            }
            filtros.tipo = tipo
        }
        return await itemRepository.getAll(filtros)
    }

    async getById(item_id){
        const item = await itemRepository.getById(item_id)
        if(!item || !item.activo){
            throw new ServerError('Item no encontrado', 404)
        }
        return item
    }

    async create({ titulo, tipo, descripcion, año, autor_o_director, imagen_url }){
        if(!titulo || titulo.trim() === ''){
            throw new ServerError('El titulo es obligatorio', 400)
        }

        if(!tipo || !ITEM_TYPES_LIST.includes(tipo)){
            throw new ServerError(`El tipo es obligatorio y debe ser uno de: ${ITEM_TYPES_LIST.join(', ')}`, 400)
        }

        return await itemRepository.create({
            titulo,
            tipo,
            descripcion,
            año,
            autor_o_director,
            imagen_url
        })
    }

    async updateById(item_id, { titulo, tipo, descripcion, año, autor_o_director, imagen_url }){
        await this.getById(item_id)

        const updated_info = {}

        if(titulo !== undefined){
            if(titulo.trim().length < 1){
                throw new ServerError('El titulo no puede estar vacio', 400)
            }
            updated_info.titulo = titulo
        }

        if(tipo !== undefined){
            if(!ITEM_TYPES_LIST.includes(tipo)){
                throw new ServerError(`El tipo debe ser uno de: ${ITEM_TYPES_LIST.join(', ')}`, 400)
            }
            updated_info.tipo = tipo
        }

        if(descripcion !== undefined) updated_info.descripcion = descripcion
        if(año !== undefined) updated_info.año = año
        if(autor_o_director !== undefined) updated_info.autor_o_director = autor_o_director
        if(imagen_url !== undefined) updated_info.imagen_url = imagen_url

        return await itemRepository.updateById(item_id, updated_info)
    }

    async deleteById(item_id){
        await this.getById(item_id)
        return await itemRepository.softDeleteById(item_id)
    }
}

const itemService = new ItemService()
export default itemService