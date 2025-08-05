import { File } from "../models/file.model.js";
import { BulkUpload } from "../models/bulkUpload.model.js";
import QRCode from "qrcode";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import generateUniqueCode from "../utils/uniqueCode.js";

// Customizable expiry duration - modify as needed
const EXPIRY_DURATION = process.env.FILE_EXPIRY_MINUTES 
    ? parseInt(process.env.FILE_EXPIRY_MINUTES) * 60 * 1000 
    : 5 * 60 * 1000; // Default 5 minutes
const getFile = asyncHandler(async (req, res) => {
    const uploadedFile = req.file; 
    const expiresAt = new Date(Date.now() + EXPIRY_DURATION);
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (!uploadedFile) {
        throw new ApiError(400, "File is required");
    }

    // Validate file size code
    const maxFileSize = process.env.MAX_FILE_SIZE || 20 * 1024 * 1024;
    if (uploadedFile.size > maxFileSize) {
        const fileSizeMB = (uploadedFile.size / (1024 * 1024)).toFixed(2);
        const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
        throw new ApiError(400, `File size too large! Your file is ${fileSizeMB}MB. Maximum allowed size is ${maxSizeMB}MB.`);
    }

    const relativePath = `/temp/${uploadedFile.filename}`; 
    const fileUrl = `https://${req.get("host")}${relativePath}`; 
    const code = await generateUniqueCode()
    
    const file = await File.create({
        file: fileUrl,
        name: uploadedFile.filename,
        originalName: uploadedFile.originalname,
        size: uploadedFile.size,
        mimetype: uploadedFile.mimetype,
        code: code,
        uploadedBy: clientIP,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString()
    });

    const downloadLink = `https://${req.get("host")}/api/v1/file/download/id/${file._id}`;
    console.log("Download Link:", downloadLink);
    const qrCode = await QRCode.toDataURL(downloadLink)
    
    return res.status(201).json(
        new ApiResponse(200, {
            file: {
                id: file._id,
                name: file.originalName,
                size: file.size,
                mimetype: file.mimetype,
                expiresAt: file.expiresAt
            },
            qrCode, 
            downloadUrl: downloadLink,   
            uniqueCode: code, 
            expiresAt 
        }, "File uploaded successfully")
    );
});
const getCode = asyncHandler(async (req, res) => {
    const { code } = req.body;
  
    if (!code) {
      throw new ApiError(400, "Code is required");
    }
  
    const fileDoc = await File.findOne({ code });
  
    if (!fileDoc) {
      throw new ApiError(404, "Invalid code");
    }
  
    if (new Date(fileDoc.expiresAt) < new Date()) {
      throw new ApiError(410, "Code expired");
    }
  
    const downloadLink = `https://${req.get("host")}/api/v1/file/download/code/${code}`;
    const qrcode = await QRCode.toDataURL(downloadLink);
  
    return res.status(200).json(
      new ApiResponse(200, {
        uniqueCode: code,
        id: fileDoc._id,
        name: fileDoc.name,
        expiresAt: fileDoc.expiresAt,
        file: fileDoc.file,
        downloadUrl: downloadLink,   
        qrCode: qrcode             
      }, "Code verified successfully")
    );
  });
  
  
// Bulk file upload handler
const getBulkFiles = asyncHandler(async (req, res) => {
    const uploadedFiles = req.files; 
    const expiresAt = new Date(Date.now() + EXPIRY_DURATION);
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new ApiError(400, "At least one file is required");
    }

    // Validate each file size
    const maxFileSize = process.env.MAX_FILE_SIZE || 20 * 1024 * 1024;
    const validFiles = [];
    const invalidFiles = [];

    for (const uploadedFile of uploadedFiles) {
        if (uploadedFile.size > maxFileSize) {
            const fileSizeMB = (uploadedFile.size / (1024 * 1024)).toFixed(2);
            const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
            invalidFiles.push({
                name: uploadedFile.originalname,
                reason: `File size too large! File is ${fileSizeMB}MB. Maximum allowed size is ${maxSizeMB}MB.`
            });
        } else {
            validFiles.push(uploadedFile);
        }
    }

    if (validFiles.length === 0) {
        throw new ApiError(400, "No valid files to upload", invalidFiles);
    }

    // Generate bulk upload ID
    const bulkId = await generateUniqueCode();
    
    // Process valid files
    const processedFiles = [];
    const failedFiles = [];

    for (const uploadedFile of validFiles) {
        try {
            const relativePath = `/temp/${uploadedFile.filename}`; 
            const fileUrl = `https://${req.get("host")}${relativePath}`; 
            const code = await generateUniqueCode();
            
            const file = await File.create({
                file: fileUrl,
                name: uploadedFile.filename,
                originalName: uploadedFile.originalname,
                size: uploadedFile.size,
                mimetype: uploadedFile.mimetype,
                code: code,
                uploadedBy: clientIP,
                createdAt: new Date().toISOString(),
                expiresAt: expiresAt.toISOString()
            });

            const downloadLink = `https://${req.get("host")}/api/v1/file/download/id/${file._id}`;
            const qrCode = await QRCode.toDataURL(downloadLink);

            processedFiles.push({
                fileId: file._id,
                originalName: file.originalName,
                size: file.size,
                mimetype: file.mimetype,
                code: code,
                downloadUrl: downloadLink,
                qrCode: qrCode,
                expiresAt: file.expiresAt,
                status: 'uploaded'
            });
        } catch (error) {
            failedFiles.push({
                name: uploadedFile.originalname,
                reason: error.message || 'Upload failed'
            });
        }
    }

    // Create bulk upload record
    const bulkUpload = await BulkUpload.create({
        bulkId: bulkId,
        files: processedFiles.map(file => ({
            fileId: file.fileId,
            originalName: file.originalName,
            size: file.size,
            status: 'uploaded'
        })),
        totalFiles: uploadedFiles.length,
        successfulUploads: processedFiles.length,
        failedUploads: failedFiles.length + invalidFiles.length,
        uploadedBy: clientIP,
        expiresAt: expiresAt.toISOString()
    });

    // Generate bulk download link
    const bulkDownloadLink = `https://${req.get("host")}/api/v1/file/bulk/download/${bulkId}`;
    const bulkQrCode = await QRCode.toDataURL(bulkDownloadLink);

    return res.status(201).json(
        new ApiResponse(200, {
            bulkId: bulkId,
            bulkDownloadUrl: bulkDownloadLink,
            bulkQrCode: bulkQrCode,
            files: processedFiles,
            summary: {
                totalFiles: uploadedFiles.length,
                successful: processedFiles.length,
                failed: failedFiles.length + invalidFiles.length
            },
            failedFiles: [...failedFiles, ...invalidFiles],
            expiresAt 
        }, `Bulk upload completed. ${processedFiles.length} files uploaded successfully`)
    );
});

// Get bulk upload details
const getBulkUpload = asyncHandler(async (req, res) => {
    const { bulkId } = req.params;

    const bulkUpload = await BulkUpload.findOne({ bulkId }).populate('files.fileId');

    if (!bulkUpload) {
        throw new ApiError(404, "Bulk upload not found");
    }

    if (new Date(bulkUpload.expiresAt) < new Date()) {
        throw new ApiError(410, "Bulk upload has expired");
    }

    // Generate download links for all files
    const filesWithLinks = bulkUpload.files.map(file => {
        const downloadLink = `https://${req.get("host")}/api/v1/file/download/id/${file.fileId._id}`;
        return {
            ...file.toObject(),
            downloadUrl: downloadLink,
            code: file.fileId.code
        };
    });

    const bulkDownloadLink = `https://${req.get("host")}/api/v1/file/bulk/download/${bulkId}`;

    return res.status(200).json(
        new ApiResponse(200, {
            bulkId: bulkUpload.bulkId,
            files: filesWithLinks,
            bulkDownloadUrl: bulkDownloadLink,
            summary: {
                totalFiles: bulkUpload.totalFiles,
                successful: bulkUpload.successfulUploads,
                failed: bulkUpload.failedUploads
            },
            expiresAt: bulkUpload.expiresAt
        }, "Bulk upload details retrieved successfully")
    );
});

export { getFile, getCode, getBulkFiles, getBulkUpload };
