import { ApiError } from '../utils/apiError.js';
export const validateRequest = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        if (!result.success) {
            const message = result.error.issues.map((issue) => issue.message).join(', ');
            next(new ApiError(400, message));
            return;
        }
        next();
    };
};
