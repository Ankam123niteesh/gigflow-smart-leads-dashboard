import { ApiError } from '../utils/apiError.js';
export const notFound = (_req, _res, next) => {
    next(new ApiError(404, 'Route not found'));
};
export const errorHandler = (error, _req, res, _next) => {
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
    }
    if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
    }
    res.status(500).json({ message: 'Internal server error' });
};
