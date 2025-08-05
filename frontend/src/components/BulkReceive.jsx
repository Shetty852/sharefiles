import React, { useContext, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ThemeContext from "../context/ThemeContext";
import { Download, FileIcon, QrCode, Copy, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { API_CONFIG, getApiUrl } from "../config/api.js";

const BulkReceive = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [bulkData, setBulkData] = useState(null);
  const [codeType, setCodeType] = useState("auto"); // auto, single, bulk
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const detectCodeType = (inputCode) => {
    // Bulk codes are typically longer and contain specific patterns
    // This is a simple heuristic - you might want to make this more sophisticated
    if (inputCode.length > 8) {
      return "bulk";
    } else {
      return "single";
    }
  };

  const checkCode = async () => {
    setLoading(true);
    setBulkData(null);
    
    if (!code.trim()) {
      toast.warning("Please enter a code before proceeding.", { position: "top-right" });
      setLoading(false);
      return;
    }

    const detectedType = codeType === "auto" ? detectCodeType(code.trim()) : codeType;

    try {
      if (detectedType === "bulk") {
        // Try bulk upload first
        await checkBulkCode();
      } else {
        // Try single file
        await checkSingleCode();
      }
    } catch {
      // If bulk fails and we're in auto mode, try single file
      if (detectedType === "bulk" && codeType === "auto") {
        try {
          await checkSingleCode();
        } catch {
          toast.error("Invalid code. Please check and try again.", { position: "top-right" });
        }
      } else {
        toast.error("Invalid code. Please check and try again.", { position: "top-right" });
      }
    } finally {
      setLoading(false);
    }
  };

  const checkBulkCode = async () => {
    const response = await axios.get(getApiUrl(`${API_CONFIG.ENDPOINTS.BULK_INFO}/${code.trim()}`));
    const data = response.data.data;
    
    setBulkData(data);
    toast.success(`Bulk upload found! ${data.summary.successful} files available`, { position: "top-right" });
  };

  const checkSingleCode = async () => {
    const response = await axios.post(
      getApiUrl(API_CONFIG.ENDPOINTS.CHECK),
      { code: code.trim() },
      { headers: { "Content-Type": "application/json" } }
    );

    const { file, downloadUrl, uniqueCode, qrCode, expiresAt, name } = response.data.data;
    
    if (uniqueCode === code.trim()) {
      navigate("/fileReceived", {
        state: { file, downloadUrl, uniqueCode, qrCode, expiresAt, name },
      });
      toast.success("File found! Redirecting...", { position: "top-right" });
    }
  };

  const downloadBulkFiles = () => {
    if (bulkData) {
      window.open(bulkData.bulkDownloadUrl, '_blank');
      toast.success("Downloading all files as ZIP...", { position: "top-right" });
    }
  };

  const downloadSingleFile = (file) => {
    window.open(file.downloadUrl, '_blank');
    toast.success(`Downloading ${file.originalName}...`, { position: "top-right" });
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`, { position: "top-right" });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return "Expired";
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s remaining`;
  };

  const startOver = () => {
    setCode("");
    setBulkData(null);
    setCodeType("auto");
  };

  if (bulkData) {
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
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className={`text-4xl sm:text-5xl font-extrabold mb-4 text-transparent bg-clip-text ${
                theme === 'light' 
                  ? 'bg-gradient-to-tl from-blue-500 to-blue-800' 
                  : 'bg-gradient-to-tl from-red-400 to-pink-300'
              }`}>
                Bulk Files Found! 📦
              </h2>
              <div className="flex justify-center items-center space-x-6 text-sm">
                <span className="flex items-center text-green-500 font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {bulkData.summary.successful} Available
                </span>
                {bulkData.summary.failed > 0 && (
                  <span className="flex items-center text-red-500 font-medium">
                    <XCircle className="w-4 h-4 mr-1" />
                    {bulkData.summary.failed} Failed
                  </span>
                )}
                <span className={`flex items-center font-medium ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTimeRemaining(bulkData.expiresAt)}
                </span>
              </div>
            </div>

            {/* Bulk Download Section */}
            <div className={`${theme === 'dark' ? 'bg-[#2a2a2a] border border-gray-600' : 'bg-blue-50 border border-blue-200'} p-6 rounded-xl mb-8`}>
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-800'} mb-4 flex items-center`}>
                <Package className="w-6 h-6 mr-2" />
                Download All Files
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={downloadBulkFiles}
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
                  onClick={() => copyToClipboard(bulkData.bulkDownloadUrl, "Bulk download link")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300 ${
                    theme === 'light' 
                      ? 'bg-white text-blue-700 border-blue-600 hover:bg-blue-600 hover:text-white' 
                      : 'bg-[#1f1f1f] text-red-300 border-red-400 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copy Link
                </motion.button>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-3`}>
                Bulk ID: <code className={`${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded`}>{bulkData.bulkId}</code>
              </p>
            </div>

            {/* Individual Files */}
            <div className="space-y-4">
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-800'}`}>
                Individual Files ({bulkData.files.length})
              </h3>
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {bulkData.files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                        onClick={() => downloadSingleFile(file)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-2xl border-2 transition-all duration-300 ${
                          theme === 'light' 
                            ? 'bg-white text-blue-700 border-blue-600 hover:bg-blue-600 hover:text-white' 
                            : 'bg-[#1f1f1f] text-red-300 border-red-400 hover:bg-red-500 hover:text-white'
                        }`}
                        title="Download File"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => copyToClipboard(file.downloadUrl, "File link")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-lg border-2 transition-all duration-300 ${
                          theme === 'light' 
                            ? 'bg-white text-blue-700 border-blue-600 hover:bg-blue-600 hover:text-white' 
                            : 'bg-[#1f1f1f] text-red-300 border-red-400 hover:bg-red-500 hover:text-white'
                        }`}
                        title="Copy Link"
                      >
                        <Copy className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => copyToClipboard(file.code, "File code")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-lg border-2 transition-all duration-300 ${
                          theme === 'light' 
                            ? 'bg-white text-green-700 border-green-600 hover:bg-green-600 hover:text-white' 
                            : 'bg-[#1f1f1f] text-green-300 border-green-400 hover:bg-green-500 hover:text-white'
                        }`}
                        title="Copy Code"
                      >
                        <QrCode className="w-4 h-4" />
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
                Check Another Code
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-4xl sm:text-5xl font-extrabold mb-4 text-transparent bg-clip-text ${
                theme === 'light' 
                  ? 'bg-gradient-to-tl from-blue-500 to-blue-800' 
                  : 'bg-gradient-to-tl from-red-400 to-pink-300'
              }`}
            >
              Receive Files 📥
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-base sm:text-lg`}
            >
              Enter a file code or bulk upload ID to access your files
            </motion.p>
          </div>

          {/* Code Type Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mb-6"
          >
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              Code Type
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                { id: "auto", label: "Auto Detect", icon: "🔍" },
                { id: "single", label: "Single File", icon: "📄" },
                { id: "bulk", label: "Bulk Upload", icon: "📦" }
              ].map((type) => (
                <label key={type.id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="codeType"
                    value={type.id}
                    checked={codeType === type.id}
                    onChange={(e) => setCodeType(e.target.value)}
                    className={`mr-2 ${theme === 'light' ? 'accent-blue-600' : 'accent-red-500'}`}
                  />
                  <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                    {type.icon} {type.label}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Code Input */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mb-8"
          >
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Enter Code
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkCode()}
                placeholder={codeType === "bulk" ? "Enter bulk upload ID..." : codeType === "single" ? "Enter file code..." : "Enter any code..."}
                className={`flex-1 px-5 py-3 text-lg rounded-xl focus:outline-none focus:ring-2 transition border-2 ${
                  theme === 'light'
                    ? 'border-blue-500 text-gray-800 focus:ring-blue-300 bg-white'
                    : 'border-red-400 bg-[#1f1f1f] text-white focus:ring-red-300'
                }`}
              />
              <motion.button
                onClick={checkCode}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`px-6 py-3 text-lg font-semibold rounded-xl transition-all duration-300 shadow-md border-2 ${
                  loading
                    ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                    : theme === 'light'
                      ? 'bg-white text-blue-700 border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-blue-300'
                      : 'bg-[#1f1f1f] text-red-300 border-red-400 hover:bg-red-500 hover:text-white hover:shadow-red-400/40'
                }`}
              >
                {loading ? '🔍 Checking...' : '📥 Check Code'}
              </motion.button>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className={`${theme === 'dark' ? 'bg-[#2a2a2a] border border-gray-600' : 'bg-blue-50 border border-blue-200'} p-6 rounded-xl`}
          >
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-800'} mb-4`}>
              How to Receive Files
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className={`${theme === 'dark' ? 'bg-[#1f1f1f] border border-gray-700' : 'bg-white border border-gray-200'} p-4 rounded-lg`}>
                <h4 className={`font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mb-2`}>
                  📄 Single Files
                </h4>
                <ul className={`space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• Enter the unique file code</li>
                  <li>• Usually 6-8 characters long</li>
                  <li>• Downloads individual file</li>
                </ul>
              </div>
              <div className={`${theme === 'dark' ? 'bg-[#1f1f1f] border border-gray-700' : 'bg-white border border-gray-200'} p-4 rounded-lg`}>
                <h4 className={`font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} mb-2`}>
                  📦 Bulk Files
                </h4>
                <ul className={`space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• Enter the bulk upload ID</li>
                  <li>• Usually longer than 8 characters</li>
                  <li>• Access multiple files at once</li>
                  <li>• Download as ZIP or individually</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BulkReceive;
