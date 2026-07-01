import './StarRating.css';

export default function StarRating({ value, onChange, readOnly = false }) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className={`star-rating ${readOnly ? 'star-rating--readonly' : ''}`}>
        {stars.map((star) => (
        <button
            key={star}
                type="button"
            className={`star-rating__star ${star <= value ? 'star-rating__star--filled' : ''}`}
            onClick={() => !readOnly && onChange?.(star)}
            disabled={readOnly}
            aria-label={`${star} de 5 estrellas`}
        >
            ★
        </button>
        ))}
    </div>
    );
}