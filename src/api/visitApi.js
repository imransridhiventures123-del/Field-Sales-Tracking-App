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

// Get list of telecallers to assign a visit to (TelecallerModal.jsx)
export const getTelecallers = async () => {
  const res = await axiosInstance.get("/api/visits/telecallers");
  return res.data.telecallers || [];
};
export const getMyStats = async () => {
  const res = await axiosInstance.get("/api/visits/stats");
  return res.data;
};

// Get visits that have an open follow-up (FollowUpPage.jsx)
// There's no dedicated backend endpoint for this, so we pull a
// generous page of recent visits and filter client-side for
// followUp.needed === true.
export const getMyFollowUps = async () => {
  const res = await axiosInstance.get("/api/visits/my", { params: { limit: 200 } });
  const visits = res.data.visits || [];
  return visits.filter((v) => v.followUp?.needed);
};

// Reschedule a follow-up's due date (FollowUpPage.jsx)
export const rescheduleFollowUp = async (id, date) => {
  const res = await axiosInstance.put(`/api/visits/${id}/followup`, { date });
  return res.data; // { visit }
};

// Mark a follow-up as done — closes it and logs an outcome note (FollowUpPage.jsx)
export const markFollowUpDone = async (id, outcomeLabel, note) => {
  const payload = { needed: false };
  if (note || outcomeLabel) {
    payload.note = `[${outcomeLabel || "Done"}] ${note || ""}`.trim();
  }
  const res = await axiosInstance.put(`/api/visits/${id}/followup`, payload);
  return res.data; // { visit }
};