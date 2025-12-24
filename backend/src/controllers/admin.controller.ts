import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import * as bookingService from '../services/booking.service';
import { Booking } from '../models/Booking.model';
import { Event } from '../models/Event.model';
import { User } from '../models/user.model';
import { logger } from '../utils/logger';

/**
 * @desc    Get all users with filters
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { search, isBlocked, page, limit } = req.query;

        const filters = {
            search: search as string,
            isBlocked: isBlocked as string,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
        };

        const result = await userService.getAllUsers(filters);

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: result,
        });
    } catch (error) {
        logger.error('Error getting all users:', error);
        next(error);
    }
};

/**
 * @desc    Update user status (block/unblock)
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private/Admin
 */
export const updateUserStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { isBlocked } = req.body;

        if (isBlocked === undefined) {
            res.status(400).json({
                success: false,
                message: 'isBlocked field is required',
            });
            return;
        }

        const user = await userService.updateUserStatus(req.params.id, isBlocked);

        res.status(200).json({
            success: true,
            message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
            data: { user },
        });
    } catch (error: any) {
        logger.error('Error updating user status:', error);

        if (error.message === 'User not found') {
            res.status(404).json({
                success: false,
                message: error.message,
            });
            return;
        }

        if (error.message.includes('admin')) {
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
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard-stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const [
            totalUsers,
            totalEvents,
            totalBookings,
            bookingsByStatus,
            recentBookings,
            popularEvents,
        ] = await Promise.all([
            // Total users (excluding admins)
            User.countDocuments({ role: 'user' }),

            // Total events
            Event.countDocuments(),

            // Total bookings
            Booking.countDocuments(),

            // Bookings by status with revenue
            Booking.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        revenue: { $sum: '$totalAmount' },
                    },
                },
            ]),

            // Recent bookings (last 10)
            Booking.find()
                .populate('user', 'name email')
                .populate('event', 'title date venue')
                .sort({ bookedAt: -1 })
                .limit(10)
                .select('-__v'),

            // Popular events (top 5 by booking count)
            Booking.aggregate([
                {
                    $group: {
                        _id: '$event',
                        bookingCount: { $sum: 1 },
                        totalRevenue: { $sum: '$totalAmount' },
                    },
                },
                { $sort: { bookingCount: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'events',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'eventDetails',
                    },
                },
                { $unwind: '$eventDetails' },
                {
                    $project: {
                        _id: 1,
                        bookingCount: 1,
                        totalRevenue: 1,
                        title: '$eventDetails.title',
                        date: '$eventDetails.date',
                        venue: '$eventDetails.venue',
                    },
                },
            ]),
        ]);

        // Calculate total revenue
        const totalRevenue = bookingsByStatus.reduce(
            (sum, item) => sum + item.revenue,
            0
        );

        res.status(200).json({
            success: true,
            message: 'Dashboard statistics retrieved successfully',
            data: {
                totalUsers,
                totalEvents,
                totalBookings,
                totalRevenue,
                bookingsByStatus,
                recentBookings,
                popularEvents,
            },
        });
    } catch (error) {
        logger.error('Error getting dashboard stats:', error);
        next(error);
    }
};

/**
 * @desc    Get user details (profile, wishlist, bookings)
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
export const getUserDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        // 1. Fetch User (with Wishlist populated)
        // Note: Wishlist in User model is an array of ObjectIds referencing 'Event'
        const user = await User.findById(id)
            .select('-password')
            .populate({
                path: 'wishlist',
                select: 'title date venue bannerUrl category price'
            });

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // 2. Fetch User's Bookings
        const bookings = await Booking.find({ user: id })
            .populate('event', 'title date venue bannerUrl')
            .sort({ bookedAt: -1 });

        res.status(200).json({
            success: true,
            message: 'User details retrieved successfully',
            data: {
                user,
                bookings
            }
        });

    } catch (error) {
        logger.error('Error getting user details:', error);
        next(error);
    }
};
