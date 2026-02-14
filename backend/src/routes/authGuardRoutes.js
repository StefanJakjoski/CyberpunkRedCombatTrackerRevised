import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { getAdminData, getProtectedData } from '../controllers/authGuardController.js';

const router = express.Router();

// protected route, accessible only to authenticated users
router.get('/protected', protect, getProtectedData);

// admin-only route, accessible only to users with admin role
router.get('/admin', protect, adminOnly, getAdminData);

export default router;