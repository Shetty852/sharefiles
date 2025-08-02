import React, { useContext } from "react";
import { HashLink } from "react-router-hash-link";
import { Mail, Info, Send, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";

const Bottom = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const buttonFunction = () => {
    setTimeout(() => {
      navigate("/about");
    }, 500);
  };

  return (
    <footer
      className={`transition-all duration-500 border-t ${
        theme === "light"
          ? "bg-gradient-to-bl from-blue-100 to-white text-gray-800 border-gray-300"
          : "bg-gradient-to-bl from-[#0f0f0f] to-[#1f1f1f] text-gray-300 border-gray-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <h2
            className={`text-xl font-bold flex items-center gap-2 ${
              theme === "light" ? "text-blue-700" : "text-red-400"
            }`}
          >
            🌐 ShareFiles
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            The most secure and fastest way to share your files online — easy, encrypted, and reliable.
          </p>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-4">Product</h3>
          <nav className="flex flex-col gap-3 text-sm">
            <HashLink
              to="/#home"
              smooth
              className="flex items-center gap-2 hover:underline hover:text-blue-500"
            >
              <Home className="w-4 h-4" /> Home
            </HashLink>
            <HashLink
              to="/#send"
              smooth
              className="flex items-center gap-2 hover:underline hover:text-blue-500"
            >
              <Send className="w-4 h-4" /> Send
            </HashLink>
            <HashLink
              to="/#receive"
              smooth
              className="flex items-center gap-2 hover:underline hover:text-blue-500"
            >
              📥 Receive
            </HashLink>
          </nav>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-4">Company</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li
              onClick={buttonFunction}
              className="cursor-pointer flex items-center gap-2 hover:underline hover:text-blue-500"
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-4">Support</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=shettyrohan852@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-500 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Contact Us
            </a>
          </ul>
        </div>
      </div>

      <div
        className={`py-5 text-center text-xs ${
          theme === "light" ? "text-gray-500" : "text-gray-400"
        }`}
      >
        © 2025{" "}
        <span
          className={`font-semibold ${
            theme === "light" ? "text-blue-700" : "text-red-400"
          }`}
        >
          ShareFiles
        </span>
        . All rights reserved. Built with ❤️ by Rohan Shetty for seamless transfer.
      </div>
    </footer>
  );
};

export default Bottom;
