// FILE: src/api/axiosInstance.js — OWNER: Imran
// CHANGE: 401 error pe ab localStorage remove NAHI hoga.
// Pehle koi bhi 401 aata toh localStorage clear ho jata aur login pe
// bhej deta tha — yeh galat tha.
// Ab: 401 aaye toh sirf error reject karo, localStorage safe rakho.
// Agar token sach mein expire ho gaya aur employee kuch nahi kar sakta,
// woh manually logout karega — ya token 90 din baad expire hoga Render pe.

import axios from "axios";

const BASE_URL = import.meta.env.DEV
  ? `http://${window.location.hostname}:5000`
  : (import.meta.env.VITE_API_URL || "http://localhost:5000");

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Har request pe token lagao automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("maavu_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 401 aaye toh SIRF error return karo — localStorage mat chuo.
// Console mein dikhe ga kahan se aaya error (debug ke liye).
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn(
        "[401] Unauthorized request to:",
        error.config?.url,
        "— localStorage safe hai, logout nahi hoga."
      );
      // localStorage.removeItem NAHI karo — yahi tha asli masla
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;