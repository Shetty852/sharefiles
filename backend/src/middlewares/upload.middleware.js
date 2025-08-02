import multer from "multer";
import path from "path";
import fs from "fs";

const tempDir = path.resolve("public/temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configurable file size limit
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE 
    ? parseInt(process.env.MAX_FILE_SIZE) 
    : 20 * 1024 * 1024; // Default 20MB

// Allowed file types (customize as needed)
const ALLOWED_MIME_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/csv',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip', 'application/x-rar-compressed',
    'video/mp4', 'video/avi', 'video/mkv',
    'audio/mpeg', 'audio/wav'
];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir); // Save files here
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

// File filter for security
const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
};

export const upload = multer({
    storage: storage,
    limits: {
       fileSize: MAX_FILE_SIZE  
    },
    fileFilter: fileFilter
});
