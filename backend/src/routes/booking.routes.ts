import { Router } from 'express';
import {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
} from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';

const router = Router();

// All booking routes require authentication
router.use(authenticate);

// User routes
router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);

// Admin routes
router.get('/', isAdmin, getAllBookings);
router.patch('/:id/status', isAdmin, updateBookingStatus);

export default router;
