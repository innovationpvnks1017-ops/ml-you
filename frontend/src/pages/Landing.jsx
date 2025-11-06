import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-tr from-purple-700 via-pink-600 to-red-500 relative overflow-hidden">
      <h1 className="text-white text-6xl font-extrabold mb-12 select-none">MLops Intelligent Analyzer</h1>
      <motion.div
        className="flex space-x-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="px-8 py-4 bg-white bg-opacity-80 rounded-lg text-purple-700 font-semibold shadow-md hover:bg-opacity-100 transition"
        >
          Login
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/register")}
          className="px-8 py-4 bg-white bg-opacity-80 rounded-lg text-purple-700 font-semibold shadow-md hover:bg-opacity-100 transition"
        >
          Sign Up
        </motion.button>
      </motion.div>
      {/* subtle particle animation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-white rounded-full absolute animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: "3s",
              opacity: 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
