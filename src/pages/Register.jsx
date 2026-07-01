import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as authApi from '../api/authApi.js';
import './AuthPages.css';

export default function Register() {
    const [form, setForm] = useState({ nombre: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
        await authApi.register(form);
        setSuccess(true);
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    }

    if (success) {
        return (
        <div className="page auth-page">
            <div className="container">
            <div className="auth-card card">
                <h1>Revisá tu correo</h1>
                <p className="success-text">
                Te enviamos un link de verificación a <strong>{form.email}</strong>. Hacé clic ahí para activar tu cuenta y después iniciá sesión.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Ir a iniciar sesión
                </Link>
            </div>
            </div>
        </div>
        );
    }

    return (
        <div className="page auth-page">
        <div className="container">
            <form className="auth-card card" onSubmit={handleSubmit}>
            <h1>Creá tu cuenta</h1>
            <p className="auth-subtitle">Empezá a calificar películas, juegos y libros.</p>

            <div className="field">
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" name="nombre" type="text" value={form.nombre} onChange={handleChange} required />
            </div>

            <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="field">
                <label htmlFor="password">Contraseña</label>
                <input id="password" name="password" type="password" minLength={6} value={form.password} onChange={handleChange} required />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>

            <p className="auth-switch">
                ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
            </p>
            </form>
        </div>
        </div>
    );
    }