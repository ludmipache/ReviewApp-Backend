import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as itemsApi from '../api/itemsApi.js';
import * as reviewsApi from '../api/reviewApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ITEM_TYPE_LABELS, ITEM_TYPE_ICONS } from '../constants/itemTypes.js';
import StarRating from '../components/StarRating.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import './ItemDetail.css';

export default function ItemDetail() {
    const { item_id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [editingReviewId, setEditingReviewId] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 0, comentario: '' });
    const [reviewError, setReviewError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function loadData() {
        setLoading(true);
        setError('');
        Promise.all([itemsApi.getItemById(item_id), reviewsApi.getReviewsByItem(item_id)])
        .then(([itemRes, reviewsRes]) => {
            setItem(itemRes.data.item);
            setReviews(reviewsRes.data.reviews);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item_id]);

    async function handleDeleteItem() {
        if (!confirm('¿Eliminar este título del catálogo? Esta acción no se puede deshacer.')) return;
        try {
        await itemsApi.deleteItem(item_id);
        navigate('/');
        } catch (err) {
        alert(err.message);
        }
    }

    function startEditReview(review) {
        setEditingReviewId(review._id);
        setReviewForm({ rating: review.rating, comentario: review.comentario || '' });
        setReviewError('');
    }

    function cancelEditReview() {
        setEditingReviewId(null);
        setReviewForm({ rating: 0, comentario: '' });
    }

    async function handleDeleteReview(review_id) {
        if (!confirm('¿Eliminar esta reseña?')) return;
        try {
        await reviewsApi.deleteReview(review_id);
        loadData();
        } catch (err) {
        alert(err.message);
        }
    }

    async function handleSubmitReview(e) {
        e.preventDefault();
        setReviewError('');

        if (!reviewForm.rating || reviewForm.rating < 1) {
        setReviewError('Elegí un puntaje de al menos 1 estrella.');
        return;
        }

        setSubmitting(true);
        try {
        if (editingReviewId) {
            await reviewsApi.updateReview(editingReviewId, reviewForm);
        } else {
            await reviewsApi.createReview({ fk_item_id: item_id, ...reviewForm });
        }
        cancelEditReview();
        loadData();
        } catch (err) {
        setReviewError(err.message);
        } finally {
        setSubmitting(false);
        }
    }

    if (loading) return <div className="spinner-wrap">Cargando...</div>;
    if (error) return <div className="page container"><p className="error-text">{error}</p></div>;
    if (!item) return null;

    return (
        <div className="page">
        <div className="container item-detail">
            <div className="item-detail__header">
            <div className="item-detail__poster">
                {item.imagen_url ? (
                <img src={item.imagen_url} alt={item.titulo} />
                ) : (
                <span>{ITEM_TYPE_ICONS[item.tipo]}</span>
                )}
            </div>

            <div className="item-detail__info">
                <span className="item-detail__type">{ITEM_TYPE_ICONS[item.tipo]} {ITEM_TYPE_LABELS[item.tipo]}</span>
                <h1>{item.titulo}</h1>
                <p className="item-detail__meta">
                {item.autor_o_director}{item.año ? ` · ${item.año}` : ''}
                </p>
                {item.descripcion && <p className="item-detail__description">{item.descripcion}</p>}

                {user && (
                <div className="item-detail__actions">
                    <Link to={`/items/${item_id}/editar`} className="btn btn-secondary">Editar título</Link>
                    <button className="btn btn-danger" onClick={handleDeleteItem}>Eliminar título</button>
                </div>
                )}
            </div>
            </div>

            <section className="item-detail__reviews">
            <h2>Reseñas ({reviews.length})</h2>

            {user && (
                <form className="review-form card" onSubmit={handleSubmitReview}>
                <h3>{editingReviewId ? 'Editar tu reseña' : 'Dejá tu reseña'}</h3>

                <div className="field">
                    <label>Puntaje</label>
                    <StarRating
                    value={reviewForm.rating}
                    onChange={(val) => setReviewForm({ ...reviewForm, rating: val })}
                    />
                </div>

                <div className="field">
                    <label htmlFor="comentario">Comentario (opcional)</label>
                    <textarea
                    id="comentario"
                    rows={3}
                    value={reviewForm.comentario}
                    onChange={(e) => setReviewForm({ ...reviewForm, comentario: e.target.value })}
                    />
                </div>

                {reviewError && <p className="error-text">{reviewError}</p>}

                <div className="review-form__actions">
                    <button className="btn btn-primary" type="submit" disabled={submitting}>
                    {submitting ? 'Guardando...' : editingReviewId ? 'Guardar cambios' : 'Publicar reseña'}
                    </button>
                    {editingReviewId && (
                    <button type="button" className="btn btn-secondary" onClick={cancelEditReview}>
                        Cancelar
                    </button>
                    )}
                </div>
                </form>
            )}

            {reviews.length === 0 ? (
                <div className="empty-state">
                <p>Todavía no hay reseñas para este título. ¡Sé el primero en opinar!</p>
                </div>
            ) : (
                <div className="reviews-list">
                {reviews.map((review) => (
                    <ReviewCard
                    key={review._id}
                    review={review}
                    isOwner={user && review.fk_user_id?._id === user.id}
                    onEdit={() => startEditReview(review)}
                    onDelete={() => handleDeleteReview(review._id)}
                    />
                ))}
                </div>
            )}
            </section>
        </div>
        </div>
    );
}