import { useEffect, useState } from 'react';
import * as itemsApi from '../api/itemsApi.js';
import ItemCard from '../components/ItemCard.jsx';
import { ITEM_TYPE_LABELS, ITEM_TYPE_ICONS, ITEM_TYPES } from '../constants/itemTypes.js';
import './ItemList.css';

export default function ItemsList() {
    const [items, setItems] = useState([]);
    const [tipo, setTipo] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        itemsApi
        .getItems(tipo || undefined)
        .then((res) => setItems(res.data.items))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, [tipo]);

    return (
        <div className="page">
        <div className="container">
            <div className="catalog-header">
            <div>
                <h1>El catálogo</h1>
                <p className="catalog-subtitle">Películas, videojuegos y libros, todo en un solo lugar.</p>
            </div>
            </div>

            <div className="catalog-filters">
            <button
                className={`filter-chip ${tipo === '' ? 'filter-chip--active' : ''}`}
                onClick={() => setTipo('')}
            >
                Todo
            </button>
            {ITEM_TYPES.map((t) => (
                <button
                key={t}
                className={`filter-chip ${tipo === t ? 'filter-chip--active' : ''}`}
                onClick={() => setTipo(t)}
                >
                {ITEM_TYPE_ICONS[t]} {ITEM_TYPE_LABELS[t]}
                </button>
            ))}
            </div>

            {loading && <div className="spinner-wrap">Cargando catálogo...</div>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && items.length === 0 && (
            <div className="empty-state">
                <p>Todavía no hay títulos {tipo ? `de tipo "${ITEM_TYPE_LABELS[tipo]}"` : ''} cargados.</p>
            </div>
            )}

            {!loading && items.length > 0 && (
            <div className="catalog-grid">
                {items.map((item) => (
                <ItemCard key={item._id} item={item} />
                ))}
            </div>
            )}
        </div>
        </div>
    );
}