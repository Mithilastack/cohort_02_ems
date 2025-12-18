import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';

let isConfigured = false;

// Lazy configuration - only configure when first used
const ensureConfigured = () => {
    if (isConfigured) return;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Log configuration status (without exposing secrets)
    logger.info(`Cloudinary Config - Cloud Name: ${cloudName ? 'SET' : 'MISSING'}, API Key: ${apiKey ? 'SET' : 'MISSING'}, API Secret: ${apiSecret ? 'SET' : 'MISSING'}`);

    if (!cloudName || !apiKey || !apiSecret) {
        logger.error('Cloudinary is not properly configured. Please check your .env file.');
        throw new Error('Cloudinary credentials missing in environment variables');
    }

    // Configure Cloudinary
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });

    isConfigured = true;
    logger.info('Cloudinary configured successfully');
};

// Export wrapped cloudinary with lazy config
export default {
    get uploader() {
        ensureConfigured();
        return cloudinary.uploader;
    },
    get api() {
        ensureConfigured();
        return cloudinary.api;
    },
};

