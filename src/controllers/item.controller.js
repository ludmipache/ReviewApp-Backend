import itemService from '../services/item.services.js';
import ServerError from '../helpers/ServerErrors.js';

class ItemController {
    async getAll(request, response) {
        try {
            const { tipo } = request.query;

            const items = await itemService.getAll(tipo);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'Items obtenidos',
                data: { items }
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
            const { item_id } = request.params;

            const item = await itemService.getById(item_id);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'Item obtenido',
                data: { item }
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
            const new_item = await itemService.create(request.body);

            return response.status(201).json({
                ok: true,
                status: 201,
                message: 'Item creado con exito',
                data: { item: new_item }
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
            const { item_id } = request.params;

            const updated_item = await itemService.updateById(item_id, request.body);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'Item actualizado con exito',
                data: { item: updated_item }
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
            const { item_id } = request.params;

            const deleted_item = await itemService.deleteById(item_id);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'Item eliminado con exito',
                data: { item: deleted_item }
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

const itemController = new ItemController();
export default itemController;