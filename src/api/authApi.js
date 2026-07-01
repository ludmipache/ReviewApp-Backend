import { apiRequest } from './clientApi.js';

export function register({ nombre, email, password }) {
    return apiRequest('/api/auth/register', {
        method: 'POST',
        body: { nombre, email, password },
    });
}

export function login({ email, password }) {
    return apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, password },
});
}

export function verifyEmail(verification_token) {
    return apiRequest(`/api/auth/verify-email?verification_token=${encodeURIComponent(verification_token)}`, {
        method: 'GET',
});
}