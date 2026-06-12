// ============================================================
//  FILE: src/api/visitApi.js
//  OWNER: Naveen
//  PURPOSE: All API calls related to visits
//           Called by VisitContext's submitVisit()
//           and MyVisitsPage to fetch visit history
// ============================================================

import axios from "./axiosInstance";

// ── SUBMIT A NEW VISIT ──────────────────────────────────────
// Called from VisitContext.submitVisit()
// Payload: { shopName, shopCode, ownerName, mobile, shopType,
//            address, categories, latitude, longitude,
//            locationAccuracy, photos, notes }
export const submitVisit = async (payload) => {
  const response = await axios.post("/visits", payload);
  return response.data; // { visit: { _id, ... } }
};

// ── GET ALL VISITS FOR LOGGED-IN EMPLOYEE ──────────────────
// Called from MyVisitsPage to show visit history
// Optional params: { page, limit, date, shopName }
export const getMyVisits = async (params = {}) => {
  const response = await axios.get("/visits/my", { params });
  return response.data; // { visits: [...], total, page }
};

// ── GET SINGLE VISIT DETAIL ────────────────────────────────
// Called from VisitDetailPage
// visitId: MongoDB _id string
export const getVisitById = async (visitId) => {
  const response = await axios.get(`/visits/${visitId}`);
  return response.data; // { visit: { ... } }
};

// ── DELETE A VISIT ─────────────────────────────────────────
// Called from MyVisitsPage if user wants to delete
export const deleteVisit = async (visitId) => {
  const response = await axios.delete(`/visits/${visitId}`);
  return response.data;
};