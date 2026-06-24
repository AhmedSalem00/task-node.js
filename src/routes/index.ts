import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import userRoutes from './user.routes';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public
router.use('/auth', authRoutes);

// Protected — every route below requires a valid JWT
router.use('/projects', authenticate, projectRoutes);
router.use('/users', authenticate, userRoutes);

export default router;
