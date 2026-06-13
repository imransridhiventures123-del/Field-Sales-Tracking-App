// ============================================================
//  FILE: src/api/axiosInstance.js
//  OWNER: Imran
//  PURPOSE: Single axios setup used by ALL api files.
//           Sets the base URL and automatically attaches
//           the JWT token to every request header.
//
//  EVERY api file imports from here — never create a
//  separate axios instance in each file.
// ============================================================

import axios from "axios";

// Base URL of your backend API
// During development → your Node.js server running locally
// After deployment  → your Render.com backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// import.meta.env.VITE_API_URL reads from your .env file:
//   VITE_API_URL=http://localhost:5000
// If .env is missing it falls back to localhost:5000

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── REQUEST INTERCEPTOR ──
// Runs before EVERY request is sent.
// Reads the token from localStorage and adds it to the header.
// This means you never have to manually add Authorization header
// in any api file — it happens automatically here.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("maavu_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR ──
// Runs after EVERY response comes back.
// If backend returns 401 (token expired / invalid),
// automatically log the user out and redirect to login.
axiosInstance.interceptors.response.use(
  (response) => response, // success → just return the response
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid → clear storage and go to login
      localStorage.removeItem("maavu_token");
      localStorage.removeItem("maavu_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;