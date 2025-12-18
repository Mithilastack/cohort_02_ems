import { Router } from 'express';
import {
    signup,
    login,
    forgotPassword,
    resetPassword,
} from '../controllers/auth.controller';

const router = Router();

// All auth routes are public
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
