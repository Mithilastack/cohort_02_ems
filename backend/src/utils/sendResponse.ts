import { Response } from 'express';

interface SuccessResponse {
    success: true;
    message: string;
    data?: any;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

interface ErrorResponse {
    success: false;
    message: string;
    error?: string;
}

/**
 * Send standardized success response
 */
export const sendSuccess = (
    res: Response,
    statusCode: number,
    message: string,
    data?: any,
    pagination?: any
): void => {
    const response: SuccessResponse = {
        success: true,
        message,
    };

    if (data !== undefined) {
        response.data = data;
    }

    if (pagination) {
        response.pagination = pagination;
    }

    res.status(statusCode).json(response);
};

/**
 * Send standardized error response
 */
export const sendError = (
    res: Response,
    statusCode: number,
    message: string,
    error?: string
): void => {
    const response: ErrorResponse = {
        success: false,
        message,
    };

    // Include error details only in development mode
    if (error && process.env.NODE_ENV === 'development') {
        response.error = error;
    }

    res.status(statusCode).json(response);
};
