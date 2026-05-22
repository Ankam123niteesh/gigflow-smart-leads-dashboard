import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/token.js';

export const protect = (req: Request, _res: Response, next: NextFunction): void => {
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
  } catch {
    next(new ApiError(401, 'Not authorized, token invalid'));
  }
};

export const authorizeRoles = (...allowedRoles: Array<'Admin' | 'Sales User'>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
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
