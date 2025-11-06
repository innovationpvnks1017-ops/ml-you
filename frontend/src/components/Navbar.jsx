import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import useDarkMode from "../hooks/useDarkMode";

export default function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
        <Link to="/" className="font-bold text-2xl tracking-wide select-none">
          MLops Analyzer
        </Link>
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <div
          className={`w-full md:flex md:w-auto md:items-center ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <ul className="md:flex md:space-x-6">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "block py-2 px-3 rounded bg-white text-purple-700 font-semibold" : "block py-2 px-3 rounded hover:bg-white hover:text-purple-700"
                }
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            {user && (
              <>
                <li>
                  <NavLink
                    to="/form"
                    className={({ isActive }) =>
                      isActive ? "block py-2 px-3 rounded bg-white text-purple-700 font-semibold" : "block py-2 px-3 rounded hover:bg-white hover:text-purple-700"
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Train
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive ? "block py-2 px-3 rounded bg-white text-purple-700 font-semibold" : "block py-2 px-3 rounded hover:bg-white hover:text-purple-700"
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                </li>
              </>
            )}
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? "block py-2 px-3 rounded bg-white text-purple-700 font-semibold" : "block py-2 px-3 rounded hover:bg-white hover:text-purple-700"
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </NavLink>
              </li>
            )}
            {!user ? (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? "block py-2 px-3 rounded bg-white text-purple-700 font-semibold" : "block py-2 px-3 rounded hover:bg-white hover:text-purple-700"
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      isActive ? "block py-2 px-3 rounded bg-white text-purple-700 font-semibold" : "block py-2 px-3 rounded hover:bg-white hover:text-purple-700"
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block py-2 px-3 rounded hover:bg-white hover:text-purple-700"
                >
                  Logout
                </button>
              </li>
            )}
            <li>
              <button
                onClick={() => {
                  toggleDarkMode();
                  setMenuOpen(false);
                }}
                aria-label="Toggle dark mode"
                className="block py-2 px-3 rounded hover:bg-white hover:text-purple-700"
              >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
