import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as itemsApi from '../api/itemsApi.js';
import { ITEM_TYPE_LABELS, ITEM_TYPES } from '../constants/itemTypes.js';
import './ItemForm.css';

const EMPTY_FORM = {
    titulo: '',
    tipo: '',
    descripcion: '',
    año: '',
    autor_o_director: '',
    imagen_url: '',
    };

    export default function ItemForm() {
    const { item_id } = useParams();
    const isEditing = Boolean(item_id);
    const navigate = useNavigate();

    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(isEditing);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isEditing) return;
        itemsApi
        .getItemById(item_id)
        .then((res) => {
            const item = res.data.item;
            setForm({
            titulo: item.titulo || '',
            tipo: item.tipo || '',
            descripcion: item.descripcion || '',
            año: item.año || '',
            autor_o_director: item.autor_o_director || '',
            imagen_url: item.imagen_url || '',
            });
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, [item_id, isEditing]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const payload = {
        ...form,
        año: form.año ? Number(form.año) : undefined,
        };

        try {
        if (isEditing) {
            await itemsApi.updateItem(item_id, payload);
            navigate(`/items/${item_id}`);
        } else {
            const res = await itemsApi.createItem(payload);
            navigate(`/items/${res.data.item._id}`);
        }
        } catch (err) {
        setError(err.message);
        } finally {
        setSubmitting(false);
        }
    }

    if (loading) return <div className="spinner-wrap">Cargando...</div>;

    return (
        <div className="page">
        <div className="container">
            <form className="item-form card" onSubmit={handleSubmit}>
            <h1>{isEditing ? 'Editar título' : 'Agregar título al catálogo'}</h1>
            <p className="item-form__subtitle">
                Completá los datos básicos. Cualquier persona registrada puede sumar o editar títulos.
            </p>

            <div className="field">
                <label htmlFor="titulo">Título</label>
                <input id="titulo" name="titulo" value={form.titulo} onChange={handleChange} required />
            </div>

            <div className="field">
                <label htmlFor="tipo">Categoría</label>
                <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange} required>
                <option value="" disabled>Elegí una categoría</option>
                {ITEM_TYPES.map((t) => (
                    <option key={t} value={t}>{ITEM_TYPE_LABELS[t]}</option>
                ))}
                </select>
            </div>

            <div className="item-form__row">
                <div className="field">
                <label htmlFor="autor_o_director">Autor / Director / Estudio</label>
                <input id="autor_o_director" name="autor_o_director" value={form.autor_o_director} onChange={handleChange} />
                </div>

                <div className="field">
                <label htmlFor="año">Año</label>
                <input id="año" name="año" type="number" value={form.año} onChange={handleChange} />
                </div>
            </div>

            <div className="field">
                <label htmlFor="imagen_url">URL de imagen / portada (opcional)</label>
                <input id="imagen_url" name="imagen_url" value={form.imagen_url} onChange={handleChange} />
            </div>

            <div className="field">
                <label htmlFor="descripcion">Descripción</label>
                <textarea id="descripcion" name="descripcion" rows={4} value={form.descripcion} onChange={handleChange} />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="item-form__actions">
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Agregar título'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                Cancelar
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}