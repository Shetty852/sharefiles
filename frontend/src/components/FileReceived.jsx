import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line
import ThemeContext from "../context/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import { API_CONFIG } from "../config/api.js";

export default function FileReceived() {
  const { state } = useLocation();
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // Download function with proper security handling
  const handleDownload = async () => {
    try {
      const downloadUrl = state.downloadUrl;
      
      // For cross-origin downloads, use a different approach
      // First, try to fetch with proper headers
      const response = await fetch(downloadUrl, {
        method: 'GET',
        credentials: 'omit', // Don't send credentials for cross-origin
        mode: 'cors',
        headers: {
          'Accept': '*/*',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      
      // Get the blob
      const blob = await response.blob();
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = state.file?.name || state.name || 'download';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = filename;
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
      toast.success("Download started successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Download error:", error);
      
      // Fallback: Open in new window with download attributes
      try {
        const link = document.createElement('a');
        link.href = state.downloadUrl;
        link.download = state.file?.name || state.name || 'download';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.info("Opening download in new tab...", { position: "top-right" });
      } catch (fallbackError) {
        console.error("Fallback download failed:", fallbackError);
        toast.error("Download failed. Please right-click the link and 'Save as...'", { 
          position: "top-right",
          autoClose: 6000 
        });
      }
    }
  };

  useEffect(() => {
    if (!state?.expiresAt) return;
    const expiryTime = new Date(state.expiresAt).getTime();
    const msUntilExpiry = expiryTime - Date.now();

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setTimeLeft(diff);
    }, 1000);

    const timeout = setTimeout(() => navigate("/"), msUntilExpiry);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [state?.expiresAt, navigate]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };
  
  function copyFunction() {
    var copyText = document.getElementById("myCode");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    toast.success("Code copied sucessfully",{position:"top-right"})
  }
  

  if (!state)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        ❌ No file data found
      </div>
    );
    
  return (
    <div
      className={`min-h-screen px-4 py-10 flex justify-center items-center transition-all duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
          : "bg-gradient-to-l from-[#0f0f0f] to-[#1f1f1f]"
      }`}
    >
      {/* Background blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20 ${theme === 'light' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-20 ${theme === 'light' ? 'bg-indigo-400' : 'bg-red-400'}`}></div>
        <div className={`absolute top-3/4 left-1/2 w-32 h-32 rounded-full blur-2xl opacity-30 ${theme === 'light' ? 'bg-purple-400' : 'bg-orange-400'}`}></div>
      </div>
      
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 shadow-2xl p-8 rounded-3xl max-w-2xl w-full space-y-6 transition-all backdrop-blur-md ${
          theme === "light"
            ? "bg-white/80 text-gray-800 shadow-blue-500/20"
            : "bg-[#1a1a1a]/80 text-gray-200 border border-gray-700 shadow-pink-500/20"
        }`}
      >
        <div className="text-center">
          <div className="text-5xl mb-3">📁</div>
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "light"
                ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent"
            }`}
          >
            File Received Successfully! 🎉
          </h1>
          <p className={theme === "light" ? "text-gray-600" : "text-gray-300"}>
            Your file is ready to download and share
          </p>
        </div>

        <div
          className={`text-sm sm:text-base space-y-4 ${
            theme === "light" ? "text-gray-700" : "text-gray-300"
          }`}
        >
          <div className={`p-4 rounded-xl ${theme === "light" ? "bg-blue-50 border border-blue-200" : "bg-gray-800 border border-gray-600"}`}>
            <p className="flex items-center gap-2">
              <span className="text-xl">📄</span>
              <strong>File Name:</strong> {state.file?.name || state.name}
            </p>
            {state.file?.size && (
              <p className="flex items-center gap-2 mt-2 text-sm opacity-80">
                <span className="text-lg">📊</span>
                <strong>Size:</strong> {(state.file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
          </div>
          <div className={`p-4 rounded-xl ${theme === "light" ? "bg-indigo-50 border border-indigo-200" : "bg-gray-800 border border-gray-600"}`}>
            <label htmlFor="myCode" className={`font-semibold ${theme==='light'?'text-gray-700':'text-gray-300'} flex items-center gap-2 mb-3`}>
              <span className="text-xl">🔑</span> Unique Access Code:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={state.uniqueCode}
                id="myCode"
                readOnly
                tabIndex={-1}
                className={`flex-1 px-4 py-3 text-lg font-mono rounded-lg border ${theme==='light'?'bg-white text-gray-800 border-gray-300 focus:border-blue-500': 'bg-[#1f1f1f] text-white border-gray-600 focus:border-pink-500'} shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-pink-500'} pointer-events-none cursor-default`}
              />
              <button
                onClick={copyFunction}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  theme === "light" 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30 hover:shadow-blue-500/50" 
                    : "bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white shadow-pink-500/30 hover:shadow-pink-500/50"
                }`}
              >
                📋 Copy
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  theme === "light" 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30 hover:shadow-blue-500/50" 
                    : "bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white shadow-pink-500/30 hover:shadow-pink-500/50"
                }`}
              >
                📥 Download File
              </button>
              
              <a
                href={state.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  theme === "light" 
                    ? "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-white/80 backdrop-blur-sm" 
                    : "border-red-500 text-red-300 hover:bg-red-500 hover:text-white bg-[#1f1f1f]/80 backdrop-blur-sm"
                }`}
                download={state.file?.name || state.name}
              >
                🔗 Direct Link
              </a>
            </div>
            
            <div className={`p-4 rounded-xl border ${theme === "light" ? "bg-yellow-50 border-yellow-200" : "bg-yellow-900/20 border-yellow-800"}`}>
              <p className={`text-sm ${theme === "light" ? "text-yellow-800" : "text-yellow-200"}`}>
                <span className="text-lg">💡</span> <strong>Having trouble downloading?</strong><br/>
                • Try the "Direct Link" button above<br/>
                • Right-click the full URL below and select "Save link as..."<br/>
                • Check your browser's download settings and popup blocker
              </p>
            </div>
            
            <details className="text-sm">
              <summary className={`cursor-pointer font-medium transition-colors ${theme === "light" ? "text-gray-600 hover:text-gray-800" : "text-gray-400 hover:text-gray-200"}`}>
                🔗 Show full download URL
              </summary>
              <p className={`mt-2 p-3 rounded-lg break-all font-mono text-xs ${theme === "light" ? "bg-gray-100 text-gray-700" : "bg-gray-800 text-gray-300"}`}>
                {state.downloadUrl}
              </p>
            </details>
          </div>
    
        </div>

        {state.qrCode && (
          <div className="flex justify-center">
            <div className={`p-4 rounded-xl ${theme === "light" ? "bg-white shadow-lg" : "bg-gray-800 border border-gray-600"}`}>
              <img
                src={state.qrCode}
                alt="QR Code for easy sharing"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg"
              />
              <p className={`text-center text-xs mt-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                📱 Scan to download on mobile
              </p>
            </div>
          </div>
        )}

        {timeLeft > 0 && (
          <div className={`text-center p-4 rounded-xl border ${theme === "light" ? "bg-red-50 border-red-200" : "bg-red-900/20 border-red-800"}`}>
            <p className={`text-sm ${theme === "light" ? "text-red-700" : "text-red-300"}`}>
              ⏱️ <strong>Link expires in:</strong>
            </p>
            <p className={`text-3xl font-mono font-bold mt-2 ${theme === "light" ? "text-red-600" : "text-red-400"} animate-pulse`}>
              {formatTime(timeLeft)}
            </p>
            <p className={`text-xs mt-1 ${theme === "light" ? "text-red-600" : "text-red-400"}`}>
              Download now before it expires!
            </p>
          </div>
        )}

        {/* Back to Home Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className={`px-8 py-3 text-lg font-semibold rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
              theme === "light" 
                ? "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-white/80 backdrop-blur-sm" 
                : "border-red-500 text-red-300 hover:bg-red-500 hover:text-white bg-[#1f1f1f]/80 backdrop-blur-sm"
            }`}
          >
            🏠 Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
