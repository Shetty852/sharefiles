import { Router } from "express";
import multer from "multer";
import { getCode, getFile, getBulkFiles, getBulkUpload } from "../controllers/file.controller.js";
import { upload } from "../middlewares/upload.middleware.js"
// import { uploadRateLimit, codeRateLimit } from "../middlewares/rateLimit.middleware.js";
import { File } from "../models/file.model.js";
import { BulkUpload } from "../models/bulkUpload.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";
import { ApiError } from "../utils/ApiError.js";
import archiver from "archiver";

const router = Router();

// Add multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  console.log("Multer Error:", err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size allowed is ${process.env.MAX_FILE_SIZE || '20MB'}`
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }
  next(err);
};

router.post("/upload", (req, res, next) => {
  console.log("Upload endpoint hit");
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.log("Upload middleware error:", err);
      return handleMulterError(err, req, res, next);
    }
    next();
  });
}, getFile);

router.post("/bulk/upload", (req, res, next) => {
  console.log("Bulk upload endpoint hit");
  upload.array("files", 10)(req, res, (err) => {
    if (err) {
      console.log("Bulk upload middleware error:", err);
      return handleMulterError(err, req, res, next);
    }
    next();
  });
}, getBulkFiles);
router.get("/bulk/:bulkId", getBulkUpload);
router.post("/check", getCode)

router.get("/download/id/:id", asyncHandler(async (req, res) => {
  console.log(`Download request for ID: ${req.params.id}`);
  
  // Set CORS headers explicitly for downloads
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  const fileDoc = await File.findById(req.params.id);
  if (!fileDoc) {
    console.log(`File not found in database: ${req.params.id}`);
    throw new ApiError(404, "File not found");
  }

  // Check if file has expired
  if (new Date(fileDoc.expiresAt) < new Date()) {
    console.log(`File expired: ${req.params.id}`);
    throw new ApiError(410, "File has expired");
  }

  // Check download limit
  if (fileDoc.downloadCount >= fileDoc.maxDownloads) {
    console.log(`Download limit exceeded: ${req.params.id}`);
    throw new ApiError(403, "Download limit exceeded");
  }

  const fileUrl = fileDoc.file;
  const filename = fileUrl.split("/").pop();
  const filePath = path.resolve("public", "temp", filename);
  
  console.log(`Looking for file at: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.log(`File missing on disk: ${filePath}`);
    throw new ApiError(404, "File missing");
  }

  // Set proper headers for secure download
  res.setHeader('Content-Disposition', `attachment; filename="${fileDoc.originalName || filename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');

  // Increment download count
  await File.findByIdAndUpdate(req.params.id, { 
    $inc: { downloadCount: 1 } 
  });

  console.log(`Serving file: ${fileDoc.originalName || filename}`);
  res.download(filePath, fileDoc.originalName || filename);
}));

router.get("/download/code/:code", asyncHandler(async (req, res) => {
  console.log(`Download request for code: ${req.params.code}`);
  
  // Set CORS headers explicitly for downloads
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  const fileDoc = await File.findOne({ code: req.params.code });

  if (!fileDoc) {
    console.log(`File not found for code: ${req.params.code}`);
    throw new ApiError(404, "File not found");
  }

  // Check if file has expired
  if (new Date(fileDoc.expiresAt) < new Date()) {
    console.log(`File expired for code: ${req.params.code}`);
    throw new ApiError(410, "File has expired");
  }

  // Check download limit
  if (fileDoc.downloadCount >= fileDoc.maxDownloads) {
    console.log(`Download limit exceeded for code: ${req.params.code}`);
    throw new ApiError(403, "Download limit exceeded");
  }

  const filename = fileDoc.file.split("/").pop();
  const filePath = path.resolve("public", "temp", filename);
  
  console.log(`Looking for file at: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.log(`File missing on disk: ${filePath}`);
    throw new ApiError(404, "File not found on disk");
  }

  // Increment download count
  await File.findOneAndUpdate(
    { code: req.params.code }, 
    { $inc: { downloadCount: 1 } }
  );

  console.log(`Serving file: ${fileDoc.originalName || filename}`);
  res.download(filePath, fileDoc.originalName || filename);
}));
router.get("/meta/:id", asyncHandler(async (req, res) => {
  const fileDoc = await File.findById(req.params.id).select("expiresAt downloadCount maxDownloads originalName size");

  if (!fileDoc) throw new ApiError(404, "File not found");

  res.status(200).json({ 
    expiresAt: fileDoc.expiresAt,
    downloadCount: fileDoc.downloadCount,
    maxDownloads: fileDoc.maxDownloads,
    fileName: fileDoc.originalName,
    fileSize: fileDoc.size
  });
}));

// Bulk download route - creates a zip file with all files
router.get("/bulk/download/:bulkId", asyncHandler(async (req, res) => {
  const { bulkId } = req.params;

  const bulkUpload = await BulkUpload.findOne({ bulkId }).populate('files.fileId');

  if (!bulkUpload) {
    throw new ApiError(404, "Bulk upload not found");
  }

  if (new Date(bulkUpload.expiresAt) < new Date()) {
    throw new ApiError(410, "Bulk upload has expired");
  }

  // Create zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
  });

  res.attachment(`sharefiles-bulk-${bulkId}.zip`);
  archive.pipe(res);

  // Add each file to the archive
  for (const fileItem of bulkUpload.files) {
    const file = fileItem.fileId;
    if (!file) continue;

    const fileUrl = file.file;
    const filename = fileUrl.split("/").pop();
    const filePath = path.resolve("public", "temp", filename);

    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: file.originalName || filename });
    }
  }

  archive.finalize();
}));

// Analytics endpoint (basic stats)
router.get("/stats", asyncHandler(async (req, res) => {
  const totalFiles = await File.countDocuments();
  const totalBulkUploads = await BulkUpload.countDocuments();
  const totalDownloads = await File.aggregate([
    { $group: { _id: null, total: { $sum: "$downloadCount" } } }
  ]);
  
  const activeFiles = await File.countDocuments({
    expiresAt: { $gt: new Date() }
  });

  const activeBulkUploads = await BulkUpload.countDocuments({
    expiresAt: { $gt: new Date() }
  });

  res.status(200).json({
    totalFiles,
    totalBulkUploads,
    totalDownloads: totalDownloads[0]?.total || 0,
    activeFiles,
    activeBulkUploads
  });
}));

 export default router