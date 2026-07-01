import { apiRequest } from './clientApi.js';

export function getReviewsByItem(item_id) {
    return apiRequest(`/api/reviews/item/${item_id}`);
}

export function getMyReviews() {
    return apiRequest('/api/reviews/me', { auth: true });
}

export function createReview({ fk_item_id, rating, comentario }) {
    return apiRequest('/api/reviews', {
        method: 'POST',
        body: { fk_item_id, rating, comentario },
        auth: true,
    });
}

export function updateReview(review_id, data) {
    return apiRequest(`/api/reviews/${review_id}`, { method: 'PUT', body: data, auth: true });
}

export function deleteReview(review_id) {
    return apiRequest(`/api/reviews/${review_id}`, { method: 'DELETE', auth: true });
}