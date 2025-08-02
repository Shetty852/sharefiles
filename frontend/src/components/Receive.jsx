import React, { useContext, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ThemeContext from "../context/ThemeContext";

const API_BASE = import.meta.env.VITE_API_BASE;

const Receive = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const {theme} = useContext(ThemeContext)

  const checkCode = async () => {
    setLoading(true);
    setErrorMsg("");
    if (!code.trim()) {
        toast.warning("Please enter a code before proceeding.", { position: "top-right" });
        return;
      }
      
    try {
      const response = await axios.post(
        `${API_BASE}/v1/file/check`,
        { code },
        { headers: { "Content-Type": "application/json" } }
      );
     
  
      console.log("Backend Response:", response.data);
  
      const { file, downloadUrl, uniqueCode, qrCode, expiresAt,name } = response.data.data;
  
      if (uniqueCode === code) {
        navigate("/fileReceived", {
          state: { file, downloadUrl, uniqueCode, qrCode, expiresAt,name },
        });
        toast.success("Code Matches",{position: "top-right"})
        
      } else {
        toast.error("Invalid code. Please try again.", { position: "top-right" });

        setErrorMsg("❌ Invalid code. Please try again.");
      }
    } catch (err) {
      console.error("Error checking code:", err?.response?.data || err.message);
      setErrorMsg("❌ Enter a valid code.");
      toast.error("❌ Enter valid code.", { position: "top-right" });

    } finally {
      setLoading(false);
    }
  };
  const features = [
    {
      icon: "🔐",
      title: "Secure Transfer",
      desc: "Files are encrypted during transfer & storage.",
    },
    {
      icon: "⚡️",
      title: "Instant Notification",
      desc: "Get notified instantly when your files arrive.",
    },
    {
      icon: "📱",
      title: "Access Anywhere",
      desc: "View your files on any device, anytime.",
    },
  ];

  return (
    <div
      id="receive"
      className={`flex pb-5  flex-col items-center justify-center md:pt-0 pt-2 min-h-screen px-4 sm:px-6 md:px-8 transition-all duration-500 ${
        theme === "light"
          ? "bg-gradient-to-l from-white to-blue-200"
          : "bg-gradient-to-l from-[#0f0f0f] to-[#1f1f1f]"
      }`}
    >
      <ToastContainer position="top-right" autoClose={4000} theme={theme === "light" ? "light" : "dark"} />

      <motion.div
        className={`text-5xl sm:text-5xl font-bold text-center mb-4 text-transparent bg-clip-text ${
          theme === "light" ? "bg-gradient-to-tl from-blue-500 to-blue-800" : "bg-gradient-to-tl from-red-400 to-pink-300"
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Receive Files Securely
      </motion.div>

      <motion.p
        className={`text-center max-w-xl mb-8 text-base sm:text-lg ${
          theme === "light" ? "text-gray-600" : "text-gray-400"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Enter the unique code shared with you to access files. Or share your personal receive link.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <input
          type="text"
          placeholder="Enter your code"
          className={`w-full px-5 py-3 text-lg rounded-xl focus:outline-none focus:ring-2 transition border-2 ${
            theme === "light"
              ? "border-blue-500 text-gray-800 focus:ring-blue-300 bg-white"
              : "border-red-400 bg-[#1f1f1f] text-white focus:ring-red-300"
          }`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={checkCode}
          disabled={loading || !code.trim()}
          className={`px-5 f py-0 text-lg font-semibold rounded-2xl transition duration-300 shadow-md border-2 ${
            loading
              ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
              : theme === "light"
              ? "bg-white text-blue-700 border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-blue-300"
              : "bg-[#1f1f1f] text-red-300 border-red-400 hover:bg-red-500 hover:text-white hover:shadow-red-400/40"
          }`}
        >
          {loading ? "🔍 Checking..." : "🗂️ Receive"}
        </button>
      </motion.div>

      {errorMsg && (
        <motion.p
          className="mt-4 text-red-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {errorMsg}
        </motion.p>
      )}

      <p
        className={`mt-6 text-sm ${
          theme === "light" ? "text-gray-500" : "text-gray-400"
        }`}
      >
        💡 Don’t have a code?{" "}
        <HashLink
          to="#send"
          smooth
          className={`font-medium hover:underline ${
            theme === "light" ? "text-blue-600" : "text-red-400"
          }`}
        >
          Request files from someone
        </HashLink>
      </p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className={`p-6 rounded-xl transition hover:shadow-lg ${
              theme === "light"
                ? "bg-white text-gray-800 border border-gray-200"
                : "bg-[#1f1f1f] text-white border border-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl mb-2">{feature.icon}</div>
            <h4
              className={`text-lg font-semibold ${
                theme === "light"
                  ? "text-blue-600"
                  : "bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent"
              }`}
            >
              {feature.title}
            </h4>
            <p
              className={`text-sm mt-1 ${
                theme === "light" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Receive;