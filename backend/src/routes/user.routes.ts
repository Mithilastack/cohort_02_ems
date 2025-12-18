import { Router } from 'express';
import {
    getProfile,
    updateProfile,
    changePassword,
} from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadAvatar } from '../middlewares/upload.middleware';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

router.get('/', getProfile);
router.put('/', uploadAvatar, updateProfile);
router.put('/password', changePassword);

export default router;
