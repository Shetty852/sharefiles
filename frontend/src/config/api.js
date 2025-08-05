// API Configuration for ShareFiles Frontend
// Last updated: January 2025 - Production ready
export const API_CONFIG = {
  // Base API URL
  BASE_URL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'ShareFiles',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // File Configuration
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 20971520, // 20MB
  FILE_EXPIRY_MINUTES: parseInt(import.meta.env.VITE_FILE_EXPIRY_MINUTES) || 5,
  
  // API Endpoints
  ENDPOINTS: {
    // Single file operations
    UPLOAD: '/v1/file/upload',
    CHECK: '/v1/file/check',
    DOWNLOAD: '/v1/file/download',
    
    // Bulk file operations
    BULK_UPLOAD: '/v1/file/bulk/upload',
    BULK_INFO: '/v1/file/bulk',
    BULK_DOWNLOAD: '/v1/file/bulk/download',
  },
  
  // Request timeout (30 seconds)
  TIMEOUT: 30000,
  
  // Development mode check
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to check if file size is valid
export const isFileSizeValid = (fileSize) => {
  return fileSize <= API_CONFIG.MAX_FILE_SIZE;
};

export default API_CONFIG;
