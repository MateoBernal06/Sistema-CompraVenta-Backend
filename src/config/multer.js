import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'publicaciones',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { quality: 'auto' }, 
            { fetch_format: "auto" }
        ],
    },
});

const upload = multer({ storage });

export default upload;