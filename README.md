# Reseñalo — Frontend

Aplicación web para reseñar películas, videojuegos y libros (estilo Letterboxd, multi-categoría). Construida con React + Vite, consume la API del backend de ReviewApp.

## Stack

- React 18 + Vite
- React Router DOM (rutas y navegación)
- CSS plano (variables CSS / design tokens), sin frameworks de UI
- Context API para manejo de sesión (usuario + JWT)

## Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Crear un archivo `.env` en la raíz (basado en `.env.example`):
   ```env
   VITE_API_URL=http://localhost:3000
   ```
   En producción, reemplazar por la URL pública del backend desplegado (ej. `https://reviewapp-backend.onrender.com`).

3. Levantar en modo desarrollo:
   ```bash
   npm run dev
   ```

4. Generar build de producción:
   ```bash
   npm run build
   ```
   Los archivos quedan en `dist/`.

## Estructura

```
src/
 ├─ api/            # funciones que llaman a los endpoints del backend
 ├─ components/     # piezas reutilizables (Navbar, ItemCard, ReviewCard, StarRating, ProtectedRoute)
 ├─ constants/      # constantes compartidas (tipos de item)
 ├─ context/        # AuthContext: maneja el usuario logueado y el token
 ├─ pages/          # pantallas: Login, Register, VerifyEmail, ItemsList, ItemDetail, ItemForm, MyReviews
 ├─ App.jsx         # definición de rutas
 └─ main.jsx        # entry point
```

## Pantallas

| Ruta | Descripción | Requiere login |
|---|---|---|
| `/` | Catálogo de items, filtrable por tipo (película/videojuego/libro) | No |
| `/login` | Inicio de sesión | No |
| `/registro` | Registro de usuario | No |
| `/verificar-email?verification_token=...` | Pantalla a la que redirige el link del mail de verificación | No |
| `/items/:item_id` | Detalle de un item: info, reseñas, formulario para reseñar | No (reseñar sí requiere login) |
| `/items/nuevo` | Formulario para agregar un título al catálogo | Sí |
| `/items/:item_id/editar` | Formulario para editar un título | Sí |
| `/mis-resenas` | Listado de las reseñas propias | Sí |

## Sesión

El token JWT se guarda en `localStorage` junto con los datos básicos del usuario. `AuthContext` expone `user`, `login`, `logout` y `loading` a toda la aplicación. Las rutas protegidas usan el componente `ProtectedRoute`, que redirige a `/login` si no hay sesión activa.

## Diseño

Paleta oscura inspirada en cartelera de cine: fondo `#15141a`, superficie `#1f1d27`, acento ámbar `#e8a23d`. Tipografía: `Fraunces` para títulos, `Inter` para texto. Grid responsivo de 320px a 2000px de ancho.