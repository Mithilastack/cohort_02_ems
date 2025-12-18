import { Request, Response, NextFunction } from 'express';
import * as wishlistService from '../services/wishlist.service';
import { logger } from '../utils/logger';

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get user ID from authenticated request
        const userId = req.user?._id?.toString();

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }

        const wishlist = await wishlistService.getWishlist(userId);

        res.status(200).json({
            success: true,
            message: 'Wishlist retrieved successfully',
            data: {
                wishlist,
                count: wishlist.length,
            },
        });
    } catch (error) {
        logger.error('Error getting wishlist:', error);
        next(error);
    }
};

/**
 * @desc    Add event to wishlist
 * @route   POST /api/wishlist/:eventId
 * @access  Private
 */
export const addToWishlist = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get user ID from authenticated request
        const userId = req.user?._id?.toString();

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }

        const { eventId } = req.params;

        if (!eventId) {
            res.status(400).json({
                success: false,
                message: 'Event ID is required',
            });
            return;
        }

        const wishlist = await wishlistService.addToWishlist(userId, eventId);

        res.status(200).json({
            success: true,
            message: 'Event added to wishlist successfully',
            data: {
                wishlist,
                count: wishlist.length,
            },
        });
    } catch (error: any) {
        logger.error('Error adding to wishlist:', error);

        // Handle specific errors
        if (error.message === 'Invalid event ID') {
            res.status(400).json({
                success: false,
                message: error.message,
            });
            return;
        }

        if (error.message === 'Event not found') {
            res.status(404).json({
                success: false,
                message: error.message,
            });
            return;
        }

        if (error.message === 'Event is already in your wishlist') {
            res.status(400).json({
                success: false,
                message: error.message,
            });
            return;
        }

        next(error);
    }
};

/**
 * @desc    Remove event from wishlist
 * @route   DELETE /api/wishlist/:eventId
 * @access  Private
 */
export const removeFromWishlist = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get user ID from authenticated request
        const userId = req.user?._id?.toString();

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }

        const { eventId } = req.params;

        if (!eventId) {
            res.status(400).json({
                success: false,
                message: 'Event ID is required',
            });
            return;
        }

        const wishlist = await wishlistService.removeFromWishlist(userId, eventId);

        res.status(200).json({
            success: true,
            message: 'Event removed from wishlist successfully',
            data: {
                wishlist,
                count: wishlist.length,
            },
        });
    } catch (error: any) {
        logger.error('Error removing from wishlist:', error);

        // Handle specific errors
        if (error.message === 'Invalid event ID') {
            res.status(400).json({
                success: false,
                message: error.message,
            });
            return;
        }

        if (error.message === 'Event is not in your wishlist') {
            res.status(404).json({
                success: false,
                message: error.message,
            });
            return;
        }

        next(error);
    }
};
