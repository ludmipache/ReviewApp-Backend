import { apiRequest } from './clientApi.js';

export function getItems(tipo) {
    const query = tipo ? `?tipo=${encodeURIComponent(tipo)}` : '';
    return apiRequest(`/api/items${query}`);
}

export function getItemById(item_id) {
    return apiRequest(`/api/items/${item_id}`);
}

export function createItem(data) {
    return apiRequest('/api/items', { method: 'POST', body: data, auth: true });
}

export function updateItem(item_id, data) {
    return apiRequest(`/api/items/${item_id}`, { method: 'PUT', body: data, auth: true });
}

export function deleteItem(item_id) {
    return apiRequest(`/api/items/${item_id}`, { method: 'DELETE', auth: true });
}