import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface ErrorResponse {
    success: boolean;
    message: string;
    error?: any;
    stack?: string;
}

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    logger.error('Error:', err);

    const errorResponse: ErrorResponse = {
        success: false,
        message: err.message || 'Internal Server Error',
    };

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e: any) => e.message);
        errorResponse.message = messages.join(', ');
        res.status(400).json(errorResponse);
        return;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        errorResponse.message = `${field} already exists`;
        res.status(400).json(errorResponse);
        return;
    }

    // Mongoose cast error
    if (err.name === 'CastError') {
        errorResponse.message = 'Invalid ID format';
        res.status(400).json(errorResponse);
        return;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        errorResponse.message = 'Invalid token';
        res.status(401).json(errorResponse);
        return;
    }

    if (err.name === 'TokenExpiredError') {
        errorResponse.message = 'Token expired';
        res.status(401).json(errorResponse);
        return;
    }

    // Development environment - send stack trace
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error = err;
        errorResponse.stack = err.stack;
    }

    // Default error
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(errorResponse);
};
