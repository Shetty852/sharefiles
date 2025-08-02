import React, { useState, useEffect, useContext } from "react";
import { useMediaQuery } from "../customhooks/useMediaQuery";
import Hamburger from "hamburger-react";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import ThemeButton from "./ThemeButton";
import ThemeContext from "../context/ThemeContext";

const navLinks = [
  { name: "Home", href: "/#home", icon: "🏠", isHash: true },
  { name: "Send", href: "/#send", icon: "📤", isHash: true },
  { name: "Bulk Upload", href: "/bulk-send", icon: "📁", isHash: false },
  { name: "Receive", href: "/#receive", icon: "🗂️", isHash: true },
  { name: "Bulk Receive", href: "/bulk-receive", icon: "📦", isHash: false },
  { name: "About", href: "/about", icon: "📜", isHash: false },
];

const Navbar = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isOpen, setOpen] = useState(false);
  const {theme} = useContext(ThemeContext)

  useEffect(() => {
    document.body.style.overflow = isOpen && !isDesktop ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, isDesktop]);

  const handleLinkClick = () => {
    if (!isDesktop) setOpen(false);
  };

  return (
    <nav
    className={`fixed top-0 left-0 right-0 shadow-md z-50 px-6 h-20 flex justify-between items-center backdrop-blur-md ${
      theme === "light" ? "bg-white/70" : "bg-[#0a0a0a]/80"
    }`}
  >
    <div
      className={`text-4xl text-transparent bg-clip-text font-extrabold cursor-pointer tracking-wide ${
        theme === "light"
          ? "bg-gradient-to-r from-blue-500 to-blue-800"
          : "bg-gradient-to-r from-red-500 to-pink-300"
      }`}
    >
     <HashLink smooth to="/#home">ShareFiles</HashLink> 
    </div>

    {isDesktop ? (
      <div
        className={`flex space-x-10 mr-5 text-lg font-medium ${
          theme === "light" ? "text-gray-800" : "text-white"
        }`}
      >
        {navLinks.map((link) => (
          <motion.div
            key={link.name}
            whileHover={{ scale: 1.05, x: 5 }}
            transition={{ duration: 0.2 }}
          >
            {link.isHash ? (
              <HashLink
                to={link.href}
                smooth
                onClick={handleLinkClick}
                className= {`${theme === "light"
                ? "text-gray-800 hover:text-blue-600"
                : "text-white hover:text-red-400"}transition-colors duration-200 font-sans`}
              >
                {link.name}
              </HashLink>
            ) : (
              <Link
                to={link.href}
                onClick={handleLinkClick}
                className= {`${theme === "light"
                ? "text-gray-800 hover:text-blue-600"
                : "text-white hover:text-red-400"}transition-colors duration-200 font-sans`}
              >
                {link.name}
              </Link>
            )}
          </motion.div>
        ))}
        <ThemeButton />
      </div>
    ) : (
      <div className={`border-2 ${theme==='light'? "border-blue-600":"border-red-600"}  rounded-md`}>
        <Hamburger
          toggled={isOpen}
          color={theme === "light" ? "#333" : "#fff"}
          toggle={setOpen}
          rounded
          direction="right"
          size={24}
        />
      </div>
    )}

    <AnimatePresence>
      {!isDesktop && isOpen && (
        <motion.div
          initial={{ translateX: "100%" }}
          animate={{ translateX: 0 }}
          exit={{ translateX: "100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`absolute top-20 right-0 z-40 w-full flex flex-col items-start px-6 py-6 ${
            theme === "light"
              ? "bg-white/90 text-gray-800"
              : "bg-[#121212]/95 text-white"
          } backdrop-blur-lg text-lg font-semibold shadow-md`}
        >
          <div
            className={`space-y-4 py-6 px-6 rounded-2xl border-4 ${
              theme === "light" ? "border-blue-600" : "border-red-500"
            } w-full shadow-lg`}
          >
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.05, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-row gap-2"
              >
                <div>{link.icon}</div>
                {link.isHash ? (
                  <HashLink
                    to={link.href}
                    smooth
                    onClick={handleLinkClick}
                    className={`block transition-colors duration-200 text-lg font-medium ${ theme === "light"
        ? "text-gray-800 hover:text-blue-600"
        : "text-white hover:text-red-400"
                    }`}
                  >
                    {link.name}
                  </HashLink>
                ) : (
                  <Link
                    to={link.href}
                    onClick={handleLinkClick}
                    className={`block transition-colors duration-200 text-lg font-medium ${ theme === "light"
        ? "text-gray-800 hover:text-blue-600"
        : "text-white hover:text-red-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </motion.div>
            ))}
            <ThemeButton />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </nav>
  );
};

export default Navbar;
