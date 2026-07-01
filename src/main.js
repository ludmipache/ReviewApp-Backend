import express, { response } from 'express';
import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongodb.config.js";
import cors from 'cors'
import dns from 'dns';
import authRouter from './routers/auth.router.js';
import itemRouter from './routers/item.router.js';
import reviewRouter from './routers/review.router.js';
import errorHandler from './middlewares/error.middleware.js';

if(ENVIRONMENT.MODE === 'development'){
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

connectMongoDB()

const app = express();
const PORT = ENVIRONMENT.PORT;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://review-app-frontend-pi.vercel.app',
        /\.vercel\.app$/
    ],
    credentials: true
}))
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/items', itemRouter);
app.use('/api/reviews', reviewRouter);

app.get('/', (request, response) => {
    return response.status(200).json({
        ok: true,
        message: 'API de ReviewApp funcionando correctamente'
    })
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});