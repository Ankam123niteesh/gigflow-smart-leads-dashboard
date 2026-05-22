import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRoutes } from './routes/authRoutes.js';
import { leadRoutes } from './routes/leadRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { env } from './config/env.js';
export const createApp = () => {
    const app = express();
    app.use(cors({
        origin: env.clientUrl,
        credentials: true,
    }));
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));
    app.get('/api/health', (_req, res) => {
        res.status(200).json({ status: 'ok' });
    });
    app.use('/api/auth', authRoutes);
    app.use('/api/leads', leadRoutes);
    app.use(notFound);
    app.use(errorHandler);
    return app;
};
