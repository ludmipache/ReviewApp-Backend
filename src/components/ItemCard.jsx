import { Link } from 'react-router-dom';
import { ITEM_TYPE_LABELS, ITEM_TYPE_ICONS } from '../constants/itemTypes.js';
import './ItemCard.css';

export default function ItemCard({ item }) {
    return (
        <Link to={`/items/${item._id}`} className="item-card">
            <div className="item-card__poster">
                {item.imagen_url ? (
                    <img src={item.imagen_url} alt={item.titulo} loading="lazy" />
                ) : (
                <span className="item-card__placeholder">{ITEM_TYPE_ICONS[item.tipo]}</span>
        )}
                <span className="item-card__badge">{ITEM_TYPE_ICONS[item.tipo]} {ITEM_TYPE_LABELS[item.tipo]}</span>
            </div>
            <div className="item-card__body">
                <h3 className="item-card__title">{item.titulo}</h3>
                <p className="item-card__meta">
                    {item.autor_o_director || 'Autor desconocido'}{item.año ? ` · ${item.año}` : ''}
                </p>
            </div>
        </Link>
    );
}