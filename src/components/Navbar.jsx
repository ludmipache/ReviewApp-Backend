import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';


export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <header className="navbar">
            <div className="container navbar__inner">
                <Link to="/" className="navbar__brand">
                <span className="navbar__brand-mark">★</span>
                    Reseñalo
                </Link>

        <nav className="navbar__links">
            <Link to="/">Catálogo</Link>
            {user && <Link to="/mis-resenas">Mis reseñas</Link>}
            {user && <Link to="/items/nuevo">Agregar título</Link>}
        </nav>

        <div className="navbar__session">
            {user ? (
            <>
                <span className="navbar__user">Hola, {user.nombre}</span>
                <button className="btn btn-secondary" onClick={handleLogout}>
                    Salir
                </button>
            </>
            ) : (
            <>
                <Link to="/login" className="btn btn-secondary">Iniciar sesión</Link>
                <Link to="/registro" className="btn btn-primary">Crear cuenta</Link>
            </>
            )}
            </div>
        </div>
        </header>
    );
}