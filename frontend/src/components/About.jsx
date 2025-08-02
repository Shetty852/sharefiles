import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, Lock, Link2, MessageCircle, Share2 } from 'lucide-react';
import ThemeContext from '../context/ThemeContext';

const About = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen py-14 px-6 relative overflow-hidden transition-colors duration-500 ${
        isLight
          ? 'bg-gradient-to-t from-white to-blue-100 text-gray-800'
          : 'bg-gradient-to-t from-[#0f0f0f] to-[#1f1f1f] text-gray-200'
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-14">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-4xl sm:text-5xl text-center font-extrabold bg-clip-text text-transparent ${
            isLight
              ? 'bg-gradient-to-r from-blue-600 to-purple-700'
              : 'bg-gradient-to-r from-pink-400 to-red-500'
          }`}
        >
          About ShareFiles
        </motion.h1>

        <div
          className={`border rounded-xl p-6 text-center shadow-md max-w-3xl mx-auto ${
            isLight
              ? 'bg-white border-gray-200 text-gray-600'
              : 'bg-[#1e1e1e] border-gray-700 text-gray-300'
          }`}
        >
          <p className="text-lg">The simplest way to share files securely with anyone, anywhere. Fast, reliable, and completely free.</p>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-3xl font-bold text-center bg-clip-text text-transparent ${
            isLight
              ? 'bg-gradient-to-r from-blue-500 to-indigo-700'
              : 'bg-gradient-to-r from-pink-400 to-red-500'
          }`}
        >
          How ShareFiles Works
        </motion.h2>

        <div className="grid gap-10">
       
          <div
            className={`flex flex-col md:flex-row items-center border rounded-xl shadow-md p-6 gap-4 ${
              isLight
                ? 'bg-white border-gray-200 text-gray-700'
                : 'bg-[#1f1f1f] border-gray-700 text-gray-300'
            }`}
          >
            <Upload className="w-10 h-10 text-blue-500 mb-2 md:mb-0 md:mr-6" />
            <div>
              <h3 className="text-xl font-bold text-green-600 mb-1">1. Upload Your Files</h3>
              <p>Drag and drop or browse to upload. Files are encrypted instantly.</p>
              <div className="flex gap-2 mt-3 text-sm">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded">PDF</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">JPG</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">DOC</span>
                <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded">ZIP</span>
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col md:flex-row items-center border rounded-xl shadow-md p-6 gap-4 ${
              isLight
                ? 'bg-white border-gray-200 text-gray-700'
                : 'bg-[#1f1f1f] border-gray-700 text-gray-300'
            }`}
          >
            <Lock className="w-10 h-10 text-blue-500 mb-2 md:mb-0 md:mr-6" />
            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-1">2. Get Unique Code</h3>
              <p>Files get a secure, unique code. No sign-ups.</p>
              <div className="mt-3 font-mono bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-md w-fit text-sm">
                ABC1245EF
                <div className="text-xs text-gray-400">Example Code</div>
              </div>
            </div>
            
          </div>

          <div
            className={`flex flex-col md:flex-row items-center border rounded-xl shadow-md p-6 gap-4 ${
              isLight
                ? 'bg-white border-gray-200 text-gray-700'
                : 'bg-[#1f1f1f] border-gray-700 text-gray-300'
            }`}
          >
            <Share2 className="w-10 h-10 text-blue-500 mb-2 md:mb-0 md:mr-6" />
            <div>
              <h3 className="text-xl font-bold text-purple-600 mb-1">3. Share the Link</h3>
              <p>Send the code via text, QR code, or chat — no installs needed.</p>
              <div className="flex gap-4 mt-3 text-sm text-blue-600">
                <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> Text</span>
                <span className="flex items-center gap-1"><Link2 className="w-4 h-4" /> QR Code</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center flex justify-center items-center">
          <button
            onClick={() => navigate("/#send")}
            className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-md hover:scale-105 flex items-center justify-center gap-2 ${
              isLight
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-blue-500/50'
                : 'bg-gradient-to-r from-pink-600 to-red-500 text-white hover:shadow-red-400/50'
            }`}
          >
            <Upload className="w-5 h-5" /> Start Sharing Now
          </button>
        </div>

        <div className={`text-center text-sm pt-10 border-t ${
          isLight ? 'text-gray-400 border-gray-200' : 'text-gray-500 border-gray-700'
        }`}>
          <div className={`font-semibold ${isLight ? 'text-blue-600' : 'text-red-400'}`}>ShareFiles</div>
          <div>Simple. Secure. Free.</div>
          <div>Designed by Rohan Shetty</div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-20 -top-10 -left-10"></div>
        <div className="absolute w-28 h-28 bg-gradient-to-br from-pink-100 to-blue-200 rounded-full blur-2xl opacity-30 bottom-10 -right-10"></div>
      </div>
    </div>
  );
};

export default About;
