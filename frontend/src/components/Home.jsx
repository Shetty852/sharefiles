import React, { useContext } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line
import { HashLink } from 'react-router-hash-link';
import ThemeContext from '../context/ThemeContext';

const Home = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div id="home" className={`relative min-h-screen flex items-center justify-center px-4 ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50' : 'bg-gradient-to-l from-[#0f0f0f] to-[#1f1f1f]'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20 ${theme === 'light' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-20 ${theme === 'light' ? 'bg-indigo-400' : 'bg-red-400'}`}></div>
        <div className={`absolute top-3/4 left-1/2 w-32 h-32 rounded-full blur-2xl opacity-30 ${theme === 'light' ? 'bg-purple-400' : 'bg-orange-400'}`}></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className={`text-4xl md:text-6xl font-bold mb-6 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent'}`}>
          Share Files With Each Other
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className={`text-xl mb-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'}`}>
          Upload, share, and manage your files with our secure, fast, and user-friendly platform.
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <HashLink to="/#send" className={`px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30 hover:shadow-blue-500/50' : 'bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white shadow-pink-500/30 hover:shadow-pink-500/50'}`}>
            🚀 Start Sharing Now
          </HashLink>
          <HashLink to="/#receive" className={`px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-white/80 backdrop-blur-sm' : 'border-red-500 text-red-300 hover:bg-red-500 hover:text-white bg-[#1f1f1f]/80 backdrop-blur-sm'}`}>
            🗂️ Receive Files
          </HashLink>
          <a href="/bulk-send" className={`px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-white/80 backdrop-blur-sm' : 'border-red-500 text-red-300 hover:bg-red-500 hover:text-white bg-[#1f1f1f]/80 backdrop-blur-sm'}`}>
            📁 Bulk Upload
          </a>
          <a href="/bulk-receive" className={`px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${theme === 'light' ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-white/80 backdrop-blur-sm' : 'border-red-500 text-red-300 hover:bg-red-500 hover:text-white bg-[#1f1f1f]/80 backdrop-blur-sm'}`}>
            📦 Bulk Receive
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
