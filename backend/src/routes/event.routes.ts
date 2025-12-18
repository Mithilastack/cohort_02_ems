import { Router } from 'express';
import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} from '../controllers/event.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';
import { uploadBanner } from '../middlewares/upload.middleware';

const router = Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected Admin routes (with file upload support for banner)
router.post('/', authenticate, isAdmin, uploadBanner, createEvent);
router.put('/:id', authenticate, isAdmin, uploadBanner, updateEvent);
router.delete('/:id', authenticate, isAdmin, deleteEvent);

export default router;
