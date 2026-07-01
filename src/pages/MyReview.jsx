import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as reviewsApi from '../api/reviewApi.js';
import StarRating from '../components/StarRating.jsx';
import { ITEM_TYPE_ICONS } from '../constants/itemTypes.js';
import './MyReview.css';

export default function MyReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    function loadData() {
        setLoading(true);
        reviewsApi
        .getMyReviews()
        .then((res) => setReviews(res.data.reviews))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        loadData();
    }, []);

    async function handleDelete(review_id) {
        if (!confirm('¿Eliminar esta reseña?')) return;
        try {
        await reviewsApi.deleteReview(review_id);
        loadData();
        } catch (err) {
        alert(err.message);
        }
    }

    if (loading) return <div className="spinner-wrap">Cargando...</div>;

    return (
        <div className="page">
        <div className="container">
            <h1>Mis reseñas</h1>
            <p className="catalog-subtitle" style={{ marginBottom: '2rem' }}>
            Todo lo que opinaste hasta ahora.
            </p>

            {error && <p className="error-text">{error}</p>}

            {!error && reviews.length === 0 && (
            <div className="empty-state">
                <p>Todavía no dejaste ninguna reseña.</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Explorar el catálogo
                </Link>
            </div>
            )}

            <div className="my-reviews-list">
            {reviews.map((review) => (
                <div key={review._id} className="my-review-card card">
                <Link to={`/items/${review.fk_item_id?._id}`} className="my-review-card__item">
                    <span>{ITEM_TYPE_ICONS[review.fk_item_id?.tipo]}</span>
                    <strong>{review.fk_item_id?.titulo}</strong>
                </Link>

                <StarRating value={review.rating} readOnly />

                {review.comentario && <p className="my-review-card__text">{review.comentario}</p>}

                <div className="my-review-card__actions">
                    <Link to={`/items/${review.fk_item_id?._id}`} className="btn btn-secondary">
                    Ver / editar
                    </Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(review._id)}>
                    Eliminar
                    </button>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
}