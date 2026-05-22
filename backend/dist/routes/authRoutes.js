import { Router } from 'express';
import { getCurrentUser, loginUser, registerUser } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validators/authSchemas.js';
export const authRoutes = Router();
authRoutes.post('/register', validateRequest(registerSchema), registerUser);
authRoutes.post('/login', validateRequest(loginSchema), loginUser);
authRoutes.get('/me', protect, getCurrentUser);
