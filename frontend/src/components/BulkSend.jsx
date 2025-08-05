import React, { useState, useRef, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import ThemeContext from "../context/ThemeContext";
import { Upload, X, FileIcon, Download, Share2, QrCode } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const BulkSend = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return toast.error("No files dropped!", { position: "top-right" });
    
    validateAndSetFiles(droppedFiles);
  };

  const handleFileChange = (e) => {
    const selectedFileList = Array.from(e.target.files);
    if (selectedFileList.length === 0) return;
    
    validateAndSetFiles(selectedFileList);
  };

  const validateAndSetFiles = (files) => {
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
    const MAX_FILES = 10; // Maximum 10 files
    
    if (files.length > MAX_FILES) {
      toast.error(`Too many files! Maximum allowed is ${MAX_FILES} files.`, { 
        position: "top-right",
        autoClose: 5000 
      });
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push({
          name: file.name,
          reason: `File size too large! File is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum allowed is 20MB.`
        });
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      invalidFiles.forEach(file => {
        toast.error(`${file.name}: ${file.reason}`, { 
          position: "top-right",
          autoClose: 7000 
        });
      });
    }

    if (validFiles.length === 0) return;

    setSelectedFiles(validFiles);
    toast.success(`${validFiles.length} files selected for upload`, { position: "top-right" });
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleClick = () => fileInputRef.current?.click();

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload", { position: "top-right" });
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append("files", file);
    });
    
    setIsUploading(true);

    try {
      const response = await axios.post(`${API_BASE}/v1/file/bulk/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response.data.data;
      setUploadResult(result);
      
      toast.success(`Bulk upload completed! ${result.summary.successful} files uploaded successfully`, { 
        position: "top-right" 
      });

      if (result.failedFiles && result.failedFiles.length > 0) {
        result.failedFiles.forEach(file => {
          toast.error(`${file.name}: ${file.reason}`, { 
            position: "top-right",
            autoClose: 7000 
          });
        });
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Bulk upload failed";
      toast.error(errorMessage, { position: "top-right" });
      setUploadResult(null);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", { position: "top-right" });
  };

  const startOver = () => {
    setSelectedFiles([]);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadResult) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${
        theme === 'light'
          ? 'bg-gradient-to-l from-white to-blue-200'
          : 'bg-gradient-to-l from-[#0f0f0f] to-[#1f1f1f]'
      } py-8 px-4 sm:px-6 md:px-8`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme === 'dark' ? 'bg-[#1f1f1f] border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-lg p-8`}
          >
            <div className="text-center mb-8">
              <h2 className={`text-4xl sm:text-5xl font-extrabold mb-4 text-transparent bg-clip-text ${
                theme === 'light' 
                  ? 'bg-gradient-to-tl from-blue-500 to-blue-800' 
                  : 'bg-gradient-to-tl from-red-400 to-pink-300'
              }`}>
                Bulk Upload Complete! 📁
              </h2>
              <div className="flex justify-center space-x-6 text-sm">
                <span className="text-green-500 font-medium">✅ {uploadResult.summary.successful} Successful</span>
                {uploadResult.summary.failed > 0 && (
                  <span className="text-red-500 font-medium">❌ {uploadResult.summary.failed} Failed</span>
                )}
              </div>
            </div>

            {/* Bulk Download Section */}
            <div className={`${theme === 'dark' ? 'bg-[#2a2a2a] border border-gray-600' : 'bg-blue-50 border border-blue-200'} p-6 rounded-xl mb-8`}>
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-800'} mb-4`}>
                Download All Files
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={() => window.open(uploadResult.bulkDownloadUrl, '_blank')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center px-6 py-3 rounded-2xl font-semibold border-2 transition-all duration-300 shadow-md ${
                    theme === 'light' 
                      ? 'bg-white text-blue-700 border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-blue-300' 
                      : 'bg-[#1f1f1f] text-red-300 border-red-400 hover:bg-red-500 hover:text-white hover:shadow-red-400/40'
                  }`}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download as ZIP
                </motion.button>
                <motion.button
                  onClick={() => copyToClipboard(uploadResult.bulkDownloadUrl)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300 ${
                    theme === 'light' 
                      ? 'bg-white text-blue-700 border-blue-600 hover:bg-blue-600 hover:text-white' 
                      : 'bg-[#1f1f1f] text-red-300 border-red-400 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Copy Link
                </motion.button>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-3`}>
                Bulk ID: <code className={`${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded`}>{uploadResult.bulkId}</code>
              </p>
            </div>

            {/* Individual Files */}
            <div className="space-y-4">
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-800'}`}>
                Individual Files
              </h3>
              <div className="grid gap-4">
                {uploadResult.files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${theme === 'dark' ? 'bg-[#2a2a2a] border border-gray-600' : 'bg-white border border-gray-200'} p-4 rounded-xl flex items-center justify-between hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {file.originalName}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatFileSize(file.size)} • Code: {file.code}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => window.open(file.downloadUrl, '_blank')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-2xl border-2 transition-all duration-300 ${
                          theme === 'light' 
                            ? 'bg-white text-blue-700 border-blue-600 hover:bg-blue-600 hover:text-white' 
                            : 'bg-[#1f1f1f] text-red-300 border-red-400 hover:bg-red-500 hover:text-white'
                        }`}
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => copyToClipboard(file.downloadUrl)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-lg border-2 transition-all duration-300 ${
                          theme === 'light' 
                            ? 'bg-white text-blue-700 border-blue-600 hover:bg-blue-600 hover:text-white' 
                            : 'bg-[#1f1f1f] text-red-300 border-red-400 hover:bg-red-500 hover:text-white'
                        }`}
                        title="Copy Link"
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <motion.button
                onClick={startOver}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                  theme === 'light' 
                    ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-green-300' 
                    : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-green-400/40'
                }`}
              >
                Upload More Files
              </motion.button>
            </div>
          </motion.div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      theme === 'light'
        ? 'bg-gradient-to-l from-white to-blue-200'
        : 'bg-gradient-to-l from-[#0f0f0f] to-[#1f1f1f]'
    } py-8 px-4 sm:px-6 md:px-8`}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme === 'dark' ? 'bg-[#1f1f1f] border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-lg p-8`}
        >
          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-4xl sm:text-5xl font-extrabold mb-4 text-transparent bg-clip-text ${
                theme === 'light' 
                  ? 'bg-gradient-to-tl from-blue-500 to-blue-800' 
                  : 'bg-gradient-to-tl from-red-400 to-pink-300'
              }`}
            >
              Bulk File Upload 📁
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-base sm:text-lg`}
            >
              Upload multiple files at once (up to 10 files, 20MB each)
            </motion.p>
          </div>

          {/* Drag and Drop Area */}
          <motion.div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            whileHover={{ scale: 1.01 }}
            animate={{ scale: isDragging ? 1.03 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className={`
              border-4 border-dashed rounded-xl p-12 text-center cursor-pointer shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-lg
              ${isDragging 
                ? theme === 'light'
                  ? 'border-blue-500 bg-blue-100/30' 
                  : 'border-pink-400 bg-[#1a1a1a]/30'
                : theme === 'light'
                  ? 'border-gray-300 bg-white/70 hover:border-blue-500' 
                  : 'border-gray-700 bg-[#1a1a1a]/50 hover:border-red-500'
              }
            `}
          >
            <Upload className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
            </h3>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Supports all file types • Max 20MB per file • Up to 10 files
            </p>
          </motion.div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="*/*"
          />

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8"
            >
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-blue-800'}`}>
                Selected Files ({selectedFiles.length})
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${theme === 'dark' ? 'bg-[#2a2a2a] border border-gray-600' : 'bg-white border border-gray-200'} p-3 rounded-xl flex items-center justify-between hover:shadow-md transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileIcon className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {file.name}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => removeFile(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <motion.button
                  onClick={uploadFiles}
                  disabled={isUploading}
                  whileHover={{ scale: isUploading ? 1 : 1.05 }}
                  whileTap={{ scale: isUploading ? 1 : 0.95 }}
                  className={`
                    px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md
                    ${isUploading 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : theme === 'light'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-300'
                        : 'bg-red-500 hover:bg-red-600 text-white hover:shadow-red-400/40'
                    }
                  `}
                >
                  {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} Files`}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BulkSend;
