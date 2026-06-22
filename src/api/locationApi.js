// FILE: src/api/locationApi.js
// OWNER: Imran
// CHANGE: Both functions now check for a token BEFORE making any request.
// Without this guard, goOffline() was called on every app mount (including
// the login page where there's no token). That triggered a 401, which the
// axios interceptor caught, cleared localStorage, and redirected to /login
// — which remounted the app — which called goOffline() again — infinite loop
// showing "offline offline offline" every 300ms in the network tab.
// Now: no token = no request = no 401 = no loop.

import axiosInstance from "./axiosInstance";

export const updateLocation = async (latitude, longitude, accuracy) => {
  if (!localStorage.getItem("maavu_token")) return; // not logged in — skip
  try {
    await axiosInstance.post("/api/location/update", { latitude, longitude, accuracy });
  } catch {}
};

export const goOffline = async () => {
  if (!localStorage.getItem("maavu_token")) return; // not logged in — skip
  try {
    await axiosInstance.post("/api/location/offline");
  } catch {}
};