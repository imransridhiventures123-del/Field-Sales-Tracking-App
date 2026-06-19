// FILE: src/api/visitApi.js (was visitApi.js in your project)
// FULL REPLACEMENT — real API calls

import axiosInstance from "./axiosInstance";

// Submit a completed visit (UploadPhotosPage.jsx)
// Sends shop info + GPS + photos as JSON
export const submitVisit = async (visitData) => {
  try {
    const res = await axiosInstance.post("/api/visits", visitData);
    return { success: true, visit: res.data.visit };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || "Submission failed" };
  }
};

// Get logged-in employee's visits (MyVisitsPage.jsx)
export const getMyVisits = async (params = {}) => {
  const res = await axiosInstance.get("/api/visits/my", { params });
  return res.data; // { visits, total, page }
};

// Get single visit detail (VisitDetailPage.jsx)
export const getVisitById = async (id) => {
  const res = await axiosInstance.get(`/api/visits/${id}`);
  return res.data; // { visit }
};

// Get today's visits (EndOfDayPage.jsx, DashboardPage.jsx)
export const getTodayVisits = async () => {
  const res = await axiosInstance.get("/api/visits/today");
  return res.data; // { visits, total }
};

// Get my stats (DashboardPage.jsx KPI cards)
export const getMyStats = async () => {
  const res = await axiosInstance.get("/api/visits/stats");
  return res.data;
};