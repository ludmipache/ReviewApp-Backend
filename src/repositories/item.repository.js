import Item from '../models/item.models.js';

class ItemRepository {
    async getAll(filtros = {}){
        return await Item.find({ activo: true, ...filtros });
    }

    async getById(item_id){
        return await Item.findById(item_id);
    }

    async create(data){
        return await Item.create(data);
    }

    async updateById(item_id, update_data){
        return await Item.findByIdAndUpdate(item_id, update_data, { new: true });
    }

    async softDeleteById(item_id){
        return await this.updateById(item_id, { activo: false });
    }
}

const itemRepository = new ItemRepository();
export default itemRepository;