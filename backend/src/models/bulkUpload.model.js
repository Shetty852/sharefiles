import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const bulkUploadSchema = new Schema({
    bulkId: {
        type: String,
        unique: true,
        required: true
    },
    files: [{
        fileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File',
            required: true
        },
        originalName: String,
        size: Number,
        status: {
            type: String,
            enum: ['uploaded', 'failed'],
            default: 'uploaded'
        }
    }],
    totalFiles: {
        type: Number,
        required: true
    },
    successfulUploads: {
        type: Number,
        default: 0
    },
    failedUploads: {
        type: Number,
        default: 0
    },
    uploadedBy: {
        type: String, // IP address
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Auto-delete expired bulk uploads
bulkUploadSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const BulkUpload = mongoose.model('BulkUpload', bulkUploadSchema);
