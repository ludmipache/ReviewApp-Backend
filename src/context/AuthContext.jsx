import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored_user = localStorage.getItem('user_info');
        const token = localStorage.getItem('access_token');
    if (stored_user && token) {
        setUser(JSON.parse(stored_user));
    }
    setLoading(false);
    }, []);

async function login(email, password) {
    const response = await authApi.login({ email, password });
    const { profile_info, access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user_info', JSON.stringify(profile_info));
    setUser(profile_info);
    return profile_info;
}

function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setUser(null);
}

return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
    </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}