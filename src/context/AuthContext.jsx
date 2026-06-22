// FILE: src/context/AuthContext.jsx
// OWNER: Imran
// CHANGE: Added verifyToken() on mount — when the app reopens with a
// stored token, it silently calls /api/auth/me to confirm the token is
// still valid and refresh the user object. If valid → stay logged in.
// If expired/invalid → clear localStorage and go to login.
// JWT_EXPIRE on Render was extended to 30d so employees stay logged in
// for a full month without seeing the login screen again.

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("maavu_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("maavu_token") || null;
  });

  // true while we verify the stored token on first load
  const [checking, setChecking] = useState(!!localStorage.getItem("maavu_token"));

  // On app open — if we have a stored token, verify it with the backend.
  // This catches expired tokens silently instead of letting a 401 mid-session
  // surprise the employee halfway through their work day.
  useEffect(() => {
    const storedToken = localStorage.getItem("maavu_token");
    if (!storedToken) { setChecking(false); return; }

    axiosInstance.get("/api/auth/me")
      .then((res) => {
        // Token valid — refresh stored user data in case admin updated it
        const freshUser = res.data.user || res.data;
        localStorage.setItem("maavu_user", JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(() => {
        // Token expired or invalid — clear everything and go to login
        localStorage.removeItem("maavu_token");
        localStorage.removeItem("maavu_user");
        setToken(null);
        setUser(null);
      })
      .finally(() => setChecking(false));
  }, []); // runs once on mount

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

  // Show nothing while we verify the token — prevents a flash of the
  // login page before the check completes on app open
  if (checking) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}