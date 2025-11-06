import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2">© 2024 MLops Intelligent Analyzer. All rights reserved.</p>
        <div className="space-x-4">
          <a
            href="https://github.com/dasriyanka858/mlops-intelligent-analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://docs.mlops-analyzer.example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Documentation
          </a>
        </div>
      </div>
    </footer>
  );
}
