import { Router } from 'express';
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} from '../controllers/wishlist.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All wishlist routes are protected - require authentication
router.use(authenticate);

// Wishlist routes
router.get('/', getWishlist);
router.post('/:eventId', addToWishlist);
router.delete('/:eventId', removeFromWishlist);

export default router;
