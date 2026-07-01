import StarRating from './StarRating.jsx';
import './ReviewCard.css';

export default function ReviewCard({ review, isOwner, onEdit, onDelete }) {
    const fecha = new Date(review.fecha_creacion).toLocaleDateString('es-AR', {
        day: '2-digit',
            month: 'short',
    year: 'numeric',
    });

return (
    <div className="review-card">
        <div className="review-card__head">
            <div>
            <p className="review-card__author">{review.fk_user_id?.nombre || 'Usuario'}</p>
            <p className="review-card__date">{fecha}</p>
            </div>
        <StarRating value={review.rating} readOnly />
        </div>

        {review.comentario && <p className="review-card__text">{review.comentario}</p>}

        {isOwner && (
            <div className="review-card__actions">
            <button className="btn btn-secondary" onClick={onEdit}>Editar</button>
            <button className="btn btn-danger" onClick={onDelete}>Eliminar</button>
            </div>
        )}
    </div>
);
}