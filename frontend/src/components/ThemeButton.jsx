import React, { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import { motion } from "framer-motion";

const ThemeButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isLight = theme === "light";

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-colors cursor-pointer duration-300 shadow-sm text-sm font-medium
        ${isLight ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-100" 
                  : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"}`}
    >
      {isLight ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </motion.button>
  );
};

export default ThemeButton;
