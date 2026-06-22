// FILE: src/context/AuthContext.jsx
// OWNER: Imran
// CHANGE: Token verification on mount now distinguishes between:
//   - HTTP 401 (token genuinely expired/invalid) → clear + go to login
//   - Network error (Render free tier sleeping, no internet) → keep user
//     logged in with cached data — do NOT force re-login on a timeout
// This means employees stay logged in after closing/reopening the app
// even if the backend takes a few seconds to wake up.

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

  const [checking, setChecking] = useState(
    !!localStorage.getItem("maavu_token")
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("maavu_token");
    if (!storedToken) { setChecking(false); return; }

    axiosInstance.get("/api/auth/me")
      .then((res) => {
        const freshUser = res.data.user || res.data;
        localStorage.setItem("maavu_user", JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch((err) => {
        // ── KEY FIX ──────────────────────────────────────────────
        // Only force logout on 401 (token actually expired/invalid).
        // Network errors (err.response is undefined) mean Render is
        // still waking up or the device is offline — in that case we
        // keep the cached user and token so the employee goes straight
        // to the dashboard, not the login screen.
        if (err.response?.status === 401) {
          localStorage.removeItem("maavu_token");
          localStorage.removeItem("maavu_user");
          setToken(null);
          setUser(null);
        }
        // any other error (network, 5xx) → stay logged in with cache
      })
      .finally(() => setChecking(false));
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