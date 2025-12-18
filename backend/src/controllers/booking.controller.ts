import { Request, Response, NextFunction } from 'express';
import * as bookingService from '../services/booking.service';
import { logger } from '../utils/logger';

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }

        const { eventId, quantity } = req.body;

        if (!eventId || !quantity) {
            res.status(400).json({
                success: false,
                message: 'Event ID and quantity are required',
            });
            return;
        }

        if (quantity < 1) {
            res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1',
            });
            return;
        }

        const booking = await bookingService.createBooking(userId, eventId, quantity);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: { booking },
        });
    } catch (error: any) {
        logger.error('Error creating booking:', error);

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

        if (error.message.includes('seats available')) {
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
 * @desc    Get user's bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
export const getMyBookings = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }

        const bookings = await bookingService.getMyBookings(userId);

        res.status(200).json({
            success: true,
            message: 'Bookings retrieved successfully',
            data: {
                bookings,
                count: bookings.length,
            },
        });
    } catch (error) {
        logger.error('Error getting user bookings:', error);
        next(error);
    }
};

/**
 * @desc    Get all bookings with filters
 * @route   GET /api/bookings
 * @access  Private/Admin
 */
export const getAllBookings = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { status, page, limit } = req.query;

        const filters = {
            status: status as 'booked' | 'cancelled' | 'completed',
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
        };

        const result = await bookingService.getAllBookings(filters);

        res.status(200).json({
            success: true,
            message: 'All bookings retrieved successfully',
            data: result,
        });
    } catch (error) {
        logger.error('Error getting all bookings:', error);
        next(error);
    }
};

/**
 * @desc    Update booking status
 * @route   PATCH /api/bookings/:id/status
 * @access  Private/Admin
 */
export const updateBookingStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { status } = req.body;

        if (!status) {
            res.status(400).json({
                success: false,
                message: 'Status is required',
            });
            return;
        }

        if (!['booked', 'cancelled', 'completed'].includes(status)) {
            res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: booked, cancelled, or completed',
            });
            return;
        }

        const booking = await bookingService.updateBookingStatus(req.params.id, status);

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
            data: { booking },
        });
    } catch (error: any) {
        logger.error('Error updating booking status:', error);

        if (error.message === 'Invalid booking ID') {
            res.status(400).json({
                success: false,
                message: error.message,
            });
            return;
        }

        if (error.message === 'Booking not found') {
            res.status(404).json({
                success: false,
                message: error.message,
            });
            return;
        }

        next(error);
    }
};
