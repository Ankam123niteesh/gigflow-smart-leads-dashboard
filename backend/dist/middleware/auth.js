import { ApiError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/token.js';
export const protect = (req, _res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader?.startsWith('Bearer ')) {
        next(new ApiError(401, 'Not authorized, token missing'));
        return;
    }
    try {
        const token = authorizationHeader.slice(7);
        const decoded = verifyAccessToken(token);
        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch {
        next(new ApiError(401, 'Not authorized, token invalid'));
    }
};
export const authorizeRoles = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            next(new ApiError(401, 'Not authorized'));
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            next(new ApiError(403, 'Forbidden'));
            return;
        }
        next();
    };
};
