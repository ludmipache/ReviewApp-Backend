import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import * as authApi from '../api/authApi.js';
import './AuthPages.css';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('verification_token');

        if (!token) {
        setStatus('error');
        setMessage('Falta el token de verificación en el link.');
        return;
        }

        authApi
        .verifyEmail(token)
        .then((res) => {
            setStatus('success');
            setMessage(res.message);
        })
        .catch((err) => {
            setStatus('error');
            setMessage(err.message);
        });
    }, [searchParams]);

    return (
        <div className="page auth-page">
        <div className="container">
            <div className="auth-card card">
            {status === 'loading' && <p>Verificando tu email...</p>}

            {status === 'success' && (
                <>
                <h1>¡Listo!</h1>
                <p className="success-text">{message}</p>
                <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Iniciar sesión
                </Link>
                </>
            )}

            {status === 'error' && (
                <>
                <h1>Algo salió mal</h1>
                <p className="error-text">{message}</p>
                <Link to="/login" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                    Volver al login
                </Link>
                </>
            )}
            </div>
        </div>
        </div>
    );
}