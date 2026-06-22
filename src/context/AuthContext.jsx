// FILE: src/context/AuthContext.jsx — OWNER: Imran
// CHANGE: Removed the "checking" state that returned null and blocked
// the entire app while verifying the token with Render.
// Problem: Render free tier sleeps after 15 min. First request on wakeup
// takes 30–60s. During that time the app showed a blank screen. Users
// thought it crashed, reopened, and saw the login page.
// Fix: Load cached user/token from localStorage IMMEDIATELY (no blank
// screen, no delay). Verify with /api/auth/me in the background — only
// redirect to login if the backend explicitly returns 401 (token expired).
// Network errors / timeouts → stay logged in with cached data.

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("maavu_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("maavu_token") || null;
  });

  // Background token verification — does NOT block rendering
  useEffect(() => {
    const storedToken = localStorage.getItem("maavu_token");
    if (!storedToken) return;

    axiosInstance.get("/api/auth/me")
      .then((res) => {
        const freshUser = res.data.user || res.data;
        localStorage.setItem("maavu_user", JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch((err) => {
        // Only force logout on actual 401 (expired/invalid token).
        // Network errors, 502 (Render waking up), timeouts → keep logged in.
        if (err.response?.status === 401) {
          localStorage.removeItem("maavu_token");
          localStorage.removeItem("maavu_user");
          setToken(null);
          setUser(null);
        }
      });
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem("maavu_token", newToken);
    localStorage.setItem("maavu_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("maavu_token");
    localStorage.removeItem("maavu_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}