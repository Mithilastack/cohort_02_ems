import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ems';

        await mongoose.connect(mongoURI);

        logger.info(`MongoDB connected: ${mongoose.connection.host}`);
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    logger.info('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
    logger.error('MongoDB error:', error);
});
