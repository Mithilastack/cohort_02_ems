import cloudinary from '../config/cloudUpload';
import { logger } from '../utils/logger';

/**
 * Upload image buffer to Cloudinary
 * @param buffer - Image buffer from multer
 * @param folder - Cloudinary folder path (e.g., 'ems/users', 'ems/events')
 * @returns Secure URL of uploaded image
 */
export const uploadImage = async (
    buffer: Buffer,
    folder: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    logger.error('Cloudinary upload error:', error);
                    reject(new Error('Failed to upload image'));
                } else if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error('Upload failed - no result'));
                }
            }
        );

        uploadStream.end(buffer);
    });
};

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image to delete
 */
export const deleteImage = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
        logger.info(`Deleted image with public ID: ${publicId}`);
    } catch (error) {
        logger.error('Failed to delete image from Cloudinary:', error);
        throw new Error('Failed to delete image');
    }
};
