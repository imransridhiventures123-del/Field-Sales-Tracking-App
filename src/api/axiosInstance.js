// FILE: src/api/axiosInstance.js — OWNER: Imran
// CHANGE: The 401 response interceptor now skips redirect for the
// background /api/auth/me call. Previously, ANY 401 (including the
// silent token-verify on app open) would immediately clear localStorage
// and hard-redirect to login — even if the token just expired by a day.
// Now: /api/auth/me 401 is handled by AuthContext itself.
// All other 401s still force logout (correct — e.g. tampered token).

import axios from "axios";

const BASE_URL = import.meta.env.DEV
  ? `http://${window.location.hostname}:5000`
  : (import.meta.env.VITE_API_URL || "http://localhost:5000");

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("maavu_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401: skip /api/auth/me (AuthContext handles it).
// Force logout on all other 401s (real expired/invalid token mid-session).
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthCheck = url.includes("/api/auth/me") || url.includes("/api/admin/auth/me");
      if (!isAuthCheck) {
        localStorage.removeItem("maavu_token");
        localStorage.removeItem("maavu_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;