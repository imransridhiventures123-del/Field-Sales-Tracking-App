// FILE: src/api/locationApi.js  ← CREATE THIS NEW FILE
// PURPOSE: GPS tracking when employee goes Online/Offline
// Used by DashboardPage.jsx Online toggle

import axiosInstance from "./axiosInstance";

// Called every time GPS updates while employee is Online
export const updateLocation = async (latitude, longitude, accuracy) => {
  try {
    await axiosInstance.post("/api/location/update", { latitude, longitude, accuracy });
  } catch {
    // Silent fail — don't interrupt the employee's workflow
  }
};

// Called when employee taps "Go Offline"
export const goOffline = async () => {
  try {
    await axiosInstance.post("/api/location/offline");
  } catch {}
};