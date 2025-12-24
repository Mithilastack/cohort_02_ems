import { Router } from 'express';
import {
    getAllUsers,
    updateUserStatus,
    getDashboardStats,
    getUserDetails,
} from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, isAdmin);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/status', updateUserStatus);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Note: Event and Booking management are handled by their respective routes with admin middleware

export default router;
