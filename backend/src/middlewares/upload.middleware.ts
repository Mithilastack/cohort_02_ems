import multer from 'multer';
import { logger } from '../utils/logger';

// Use memory storage for Cloudinary uploads (buffer mode)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    logger.info(`File upload attempt: ${file.originalname}, type: ${file.mimetype}, size: ${file.size}`);

    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        logger.warn(`Rejected non-image file: ${file.mimetype}`);
        cb(new Error('Only image files are allowed'));
    }
};

// Configure multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
});

// Export middleware for different use cases
export const uploadAvatar = upload.single('avatar');
export const uploadBanner = upload.single('banner');
