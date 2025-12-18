import { Request, Response, NextFunction } from 'express';
import * as eventService from '../services/event.service';
import * as uploadService from '../services/upload.service';
import { logger } from '../utils/logger';

/**
 * Helper function to remove empty string values from form-data
 */
const cleanFormData = (data: any) => {
    const cleaned: any = {};
    for (const key in data) {
        if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
            cleaned[key] = data[key];
        }
    }
    return cleaned;
};

/**
 * @desc    Create new event
 * @route   POST /api/events
 * @access  Private/Admin
 */
export const createEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Clean form-data (remove empty strings)
        const eventData = cleanFormData(req.body);

        // Parse guests array if sent as JSON string (from form-data)
        if (eventData.guests && typeof eventData.guests === 'string') {
            try {
                eventData.guests = JSON.parse(eventData.guests);
            } catch (parseError) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid guests format. Must be a valid JSON array.',
                });
                return;
            }
        }

        // Convert numeric fields from strings (from form-data)
        if (eventData.totalSeats) eventData.totalSeats = parseInt(eventData.totalSeats);
        if (eventData.availableSeats) eventData.availableSeats = parseInt(eventData.availableSeats);
        if (eventData.price) eventData.price = parseFloat(eventData.price);

        // Handle banner file upload if provided
        if (req.file) {
            try {
                const bannerUrl = await uploadService.uploadImage(req.file.buffer, 'ems/events');
                eventData.bannerUrl = bannerUrl;
            } catch (uploadError) {
                logger.error('Failed to upload banner:', uploadError);
                res.status(500).json({
                    success: false,
                    message: 'Failed to upload banner image',
                });
                return;
            }
        }

        const event = await eventService.createEvent(eventData);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: { event },
        });
    } catch (error) {
        logger.error('Error creating event:', error);
        next(error);
    }
};

/**
 * @desc    Get all events with filters
 * @route   GET /api/events
 * @access  Public
 */
export const getAllEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { search, category, page, limit } = req.query;

        const filters = {
            search: search as string,
            category: category as string,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
        };

        const result = await eventService.getAllEvents(filters);

        res.status(200).json({
            success: true,
            message: 'Events retrieved successfully',
            data: result,
        });
    } catch (error) {
        logger.error('Error getting events:', error);
        next(error);
    }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
export const getEventById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const event = await eventService.getEventById(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Event retrieved successfully',
            data: { event },
        });
    } catch (error: any) {
        logger.error('Error getting event:', error);

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

        next(error);
    }
};

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Private/Admin
 */
export const updateEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Clean form-data (remove empty strings)
        const updateData = cleanFormData(req.body);

        // Parse guests array if sent as JSON string (from form-data)
        if (updateData.guests && typeof updateData.guests === 'string') {
            try {
                updateData.guests = JSON.parse(updateData.guests);
            } catch (parseError) {
                logger.error('Failed to parse guests JSON:', parseError);
                res.status(400).json({
                    success: false,
                    message: 'Invalid guests format. Must be a valid JSON array.',
                });
                return;
            }
        }

        // Convert numeric fields from strings (from form-data)
        if (updateData.totalSeats) updateData.totalSeats = parseInt(updateData.totalSeats);
        if (updateData.availableSeats) updateData.availableSeats = parseInt(updateData.availableSeats);
        if (updateData.price) updateData.price = parseFloat(updateData.price);

        // Handle banner file upload if provided
        if (req.file) {
            try {
                const bannerUrl = await uploadService.uploadImage(req.file.buffer, 'ems/events');
                updateData.bannerUrl = bannerUrl;
            } catch (uploadError) {
                logger.error('Failed to upload banner:', uploadError);
                res.status(500).json({
                    success: false,
                    message: 'Failed to upload banner image',
                });
                return;
            }
        }

        const event = await eventService.updateEvent(req.params.id, updateData);

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: { event },
        });
    } catch (error: any) {
        logger.error('Error updating event:', error);

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

        next(error);
    }
};

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Private/Admin
 */
export const deleteEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await eventService.deleteEvent(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error: any) {
        logger.error('Error deleting event:', error);

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

        next(error);
    }
};
