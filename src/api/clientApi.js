const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getToken() {
    return localStorage.getItem('access_token');
}

export async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {
    const headers = { 'Content-Type': 'application/json' };

if (auth) {
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
}

const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
});

let data;
    try {
    data = await response.json();
    } catch {
    data = null;
    }

if (!response.ok) {
    const message = data?.message || 'Ocurrio un error inesperado';
    const error = new Error(message);
    error.status = response.status;
    throw error;
}

return data;
}

export { API_URL };