import jwt from 'jsonwebtoken';

/**
 * Generate JWT token with user ID, role, and email
 * @param userId - User ID to encode in token
 * @param role - User role (admin or user)
 * @param email - User email
 * @returns JWT token string
 */
export const generateToken = (userId: string, role: string, email: string): string => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign({ userId, role, email }, jwtSecret, {
        expiresIn: '30d', // Token expires in 30 days
    });
};
