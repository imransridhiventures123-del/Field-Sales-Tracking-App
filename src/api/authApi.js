// FILE: src/api/authApi.js
// FULL REPLACEMENT — adds registerUser + all real API calls

import axiosInstance from "./axiosInstance";

// Register new employee (RegisterPage.jsx)
export const registerUser = async (data) => {
  const res = await axiosInstance.post("/api/auth/register", data);
  return res.data; // { token, user }
};

// Login (LoginPage.jsx)
export const loginUser = async (mobile, password) => {
  const res = await axiosInstance.post("/api/auth/login", { mobile, password });
  return res.data; // { token, user }
};

// Get current logged-in user (called on app startup)
export const getMe = async () => {
  const res = await axiosInstance.get("/api/auth/me");
  return res.data;
};

// Change password (ProfilePage.jsx)
export const changePassword = async (currentPassword, newPassword) => {
  const res = await axiosInstance.post("/api/auth/change-password", { currentPassword, newPassword });
  return res.data;
};

// Logout (optional)
export const logoutUser = async () => {
  try { await axiosInstance.post("/api/auth/logout"); } catch {}
};