import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const ADMIN_EMAILS = ["dasriyanka858@gmail.com", "durjoychatterjee59@gmail.com"];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      // Decode token to get email & admin status
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ email: payload.sub });
        setIsAdmin(ADMIN_EMAILS.includes(payload.sub.toLowerCase()));
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch {
        setUser(null);
        setIsAdmin(false);
      }
    } else {
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  async function login(email, password) {
    try {
      const response = await axios.post("/auth/login", { email, password });
      setToken(response.data.access_token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function register(email, password) {
    try {
      const response = await axios.post("/auth/register", { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
