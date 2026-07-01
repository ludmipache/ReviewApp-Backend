import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPages.css';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
        await login(form.email, form.password);
        navigate('/');
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="page auth-page">
        <div className="container">
            <form className="auth-card card" onSubmit={handleSubmit}>
            <h1>Iniciar sesión</h1>
            <p className="auth-subtitle">Volvé a encontrarte con tus reseñas.</p>

            <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="field">
                <label htmlFor="password">Contraseña</label>
                <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
            </button>

            <p className="auth-switch">
                ¿No tenés cuenta? <Link to="/registro">Creala gratis</Link>
            </p>
            </form>
        </div>
        </div>
    );
}