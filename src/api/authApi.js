// ============================================================
//  FILE: src/api/authApi.js
//  OWNER: Imran
//  PURPOSE: All API calls related to authentication.
//           Login, logout, get current user profile.
//
//  HOW TO USE IN LoginPage.jsx:
//    import { loginUser } from "../api/authApi";
//    const response = await loginUser(mobile, password);
//    → response = { token: "eyJ...", user: { name, id, role } }
//
//  FOLDER LOCATION:
//    src/
//      api/
//        axiosInstance.js   ← base setup (create this first)
//        authApi.js         ← this file
// ============================================================

import axiosInstance from "./axiosInstance";
// axiosInstance already has:
//   - baseURL set to your backend
//   - JWT token auto-attached to headers
//   - 401 auto-logout handling

// ── 1. LOGIN ─────────────────────────────────────────────────
// Called when employee taps "Login" button
// Sends mobile + password to backend
// Returns { token, user } on success
// Throws error on wrong credentials

export const loginUser = async (mobile, password) => {
  // axiosInstance.post(url, body)
  // url    → /api/auth/login  (backend route)
  // body   → { mobile, password } (what backend expects)
  const response = await axiosInstance.post("/api/auth/login", {
    mobile,
    password,
  });

  // response.data is what the backend sends back
  // Expected shape: { token: "eyJ...", user: { _id, name, mobile, role } }
  return response.data;
};


// ── 2. GET CURRENT USER PROFILE ──────────────────────────────
// Called on app startup to verify the stored token is still valid
// and get fresh user data from the backend
// Returns { user } on success

export const getMe = async () => {
  // GET request — no body needed
  // Token is auto-attached by axiosInstance interceptor
  const response = await axiosInstance.get("/api/auth/me");
  return response.data;
  // Expected shape: { user: { _id, name, mobile, role, employeeId } }
};


// ── 3. CHANGE PASSWORD ───────────────────────────────────────
// Called from ProfilePage when employee changes their password
// Returns success message on success

export const changePassword = async (currentPassword, newPassword) => {
  const response = await axiosInstance.post("/api/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
  // Expected shape: { message: "Password changed successfully" }
};


// ── 4. LOGOUT ────────────────────────────────────────────────
// Optional: tell backend to invalidate the token
// Most simple backends don't need this (JWT is stateless)
// but call it if your backend has a token blacklist

export const logoutUser = async () => {
  try {
    await axiosInstance.post("/api/auth/logout");
  } catch {
    // Even if backend logout fails, we still clear local storage
    // The AuthContext logout() handles that part
  }
};