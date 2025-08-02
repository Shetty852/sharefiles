import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const fileSchema = new Schema({
    file: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    maxDownloads: {
        type: Number,
        default: 10 // Limit downloads per file
    },
    uploadedBy: {
        type: String, // Could be IP address or user ID
        required: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    expiresAt: { 
        type: Date, 
        required: true 
    }
},{
    timestamps: true
})

// TTL index for automatic document deletion
fileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 

// Index for cleanup queries
fileSchema.index({ createdAt: 1 });

export const File = mongoose.model("File", fileSchema)