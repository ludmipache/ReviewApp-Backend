# ReviewApp — Backend

API REST para una aplicación de reseñas de películas, videojuegos y libros (estilo Letterboxd, multi-categoría).

## URLs de producción

- **Backend:** https://reviewapp-backend.vercel.app
- **Frontend:** https://review-app-frontend-pi.vercel.app

## Usuario de prueba (email ya verificado)

- **Email:** lud.14.pache@gmail.com
- **Password:** ludmi28

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken) para autenticación
- bcrypt para hash de contraseñas
- Nodemailer para verificación de email por correo
- dotenv para variables de entorno

## Arquitectura

```
src/
 ├─ config/         # conexión a Mongo, nodemailer, variables de entorno
 ├─ constants/      # constantes (tipos de item: pelicula, videojuego, libro)
 ├─ controllers/    # manejan request/response, delegan lógica a services
 ├─ services/       # lógica de negocio y validaciones
 ├─ repositories/   # acceso a la base de datos (Mongoose)
 ├─ models/         # esquemas de Mongoose
 ├─ middlewares/    # auth JWT, validación de input, manejo centralizado de errores
 ├─ helpers/        # ServerError (clase de error personalizada)
 └─ main.js         # entrypoint del servidor
```

Flujo de una request: **routes → middlewares → controllers → services → repositories → DB**

## Instalación local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/ludmipache/ReviewApp-Backend.git
   cd ReviewApp-Backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz (basado en `.env.example`):
   ```env
   MODE=development
   PORT=3000
   MONGO_DB_CONNECTION_STRING=mongodb+srv://usuario:password@cluster.mongodb.net
   MONGO_DB_NAME=nombre_de_la_base
   JWT_SECRET=un_secreto_largo_y_aleatorio
   GMAIL_USERNAME=tu_correo@gmail.com
   GMAIL_PASSWORD=tu_app_password_de_gmail
   URL_BACKEND=http://localhost:3000
   URL_FRONTEND=http://localhost:5173
   ```

4. Levantar el servidor:
   ```bash
   npm run dev
   ```

   El servidor queda escuchando en `http://localhost:3000`.

## Modelo de datos

- **User**: nombre, email, password (hasheado con bcrypt), email_verificado, fecha_creacion, activo.
- **Item** (catálogo): titulo, tipo (`pelicula` | `videojuego` | `libro`), descripcion, año, autor_o_director, imagen_url, activo.
- **Review** (entidad principal): fk_item_id (ref a Item), fk_user_id (ref a User), rating (1-5), comentario, fecha_creacion, activo.

Relación: cada `Review` referencia a un `Item` y a un `User`. Los listados de reviews usan `populate` para traer info del item y del usuario.

## Autenticación

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```
El token se obtiene en `POST /api/auth/login` y expira a los 7 días.

---

## Documentación de Endpoints

### Auth (`/api/auth`)

| Método | Ruta | Protegida | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | No | Registra un usuario y envía email de verificación |
| GET | `/api/auth/verify-email?verification_token=...` | No | Verifica el email del usuario |
| POST | `/api/auth/login` | No | Inicia sesión y devuelve un JWT |

**POST /api/auth/register**
```json
// Body
{
  "nombre": "Juan Perez",
  "email": "juan@mail.com",
  "password": "123456"
}
```
```json
// Respuesta 201
{
  "ok": true,
  "status": 201,
  "message": "Usuario registrado con exito. Revisa tu email para verificar tu cuenta",
  "data": { "user": { "id": "...", "nombre": "Juan Perez", "email": "juan@mail.com" } }
}
```

**POST /api/auth/login**
```json
// Body
{ "email": "juan@mail.com", "password": "123456" }
```
```json
// Respuesta 200
{
  "ok": true,
  "status": 200,
  "message": "Usuario autenticado exitosamente",
  "data": {
    "profile_info": { "nombre": "Juan Perez", "email": "juan@mail.com", "id": "..." },
    "access_token": "eyJhbGciOi..."
  }
}
```

---

### Items (`/api/items`)

| Método | Ruta | Protegida | Descripción |
|---|---|---|---|
| GET | `/api/items` | No | Lista todos los items. Filtro opcional `?tipo=pelicula\|videojuego\|libro` |
| GET | `/api/items/:item_id` | No | Detalle de un item |
| POST | `/api/items` | **Sí (JWT)** | Crea un item nuevo |
| PUT | `/api/items/:item_id` | **Sí (JWT)** | Edita un item |
| DELETE | `/api/items/:item_id` | **Sí (JWT)** | Elimina (soft delete) un item |

**POST /api/items**
```json
// Body
{
  "titulo": "The Matrix",
  "tipo": "pelicula",
  "descripcion": "Un hacker descubre la verdad sobre su realidad",
  "año": 1999,
  "autor_o_director": "Lana y Lilly Wachowski",
  "imagen_url": "https://ejemplo.com/matrix.jpg"
}
```
```json
// Respuesta 201
{
  "ok": true,
  "status": 201,
  "message": "Item creado con exito",
  "data": { "item": { "_id": "...", "titulo": "The Matrix", "tipo": "pelicula" } }
}
```

---

### Reviews (`/api/reviews`)

| Método | Ruta | Protegida | Descripción |
|---|---|---|---|
| GET | `/api/reviews` | No | Lista todas las reseñas (con populate de item y usuario) |
| GET | `/api/reviews/item/:item_id` | No | Reseñas de un item específico |
| GET | `/api/reviews/me` | **Sí (JWT)** | Reseñas del usuario autenticado |
| GET | `/api/reviews/:review_id` | No | Detalle de una reseña |
| POST | `/api/reviews` | **Sí (JWT)** | Crea una reseña |
| PUT | `/api/reviews/:review_id` | **Sí (JWT, solo autor)** | Edita una reseña propia |
| DELETE | `/api/reviews/:review_id` | **Sí (JWT, solo autor)** | Elimina (soft delete) una reseña propia |

**POST /api/reviews**
```json
// Body
{
  "fk_item_id": "665f1c2e8a1b2c3d4e5f6789",
  "rating": 5,
  "comentario": "Una obra maestra del cine"
}
```
```json
// Respuesta 201
{
  "ok": true,
  "status": 201,
  "message": "Reseña creada con exito",
  "data": { "review": { "_id": "...", "rating": 5, "comentario": "..." } }
}
```

**PUT /api/reviews/:review_id** — Solo el autor puede editar. Devuelve 403 si no es el dueño.

---

## Formato de respuesta

Todas las respuestas siguen el mismo formato:
```json
{
  "ok": true,
  "status": 200,
  "message": "Descripción legible",
  "data": { }
}
```

## Códigos de error

| Status | Significado |
|---|---|
| 400 | Datos inválidos o faltantes en el body |
| 401 | No autenticado / token inválido o expirado |
| 403 | Sin permiso para esa acción |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |