// FILE: src/context/LocationContext.jsx — OWNER: Imran
// CHANGES:
//   1. Location stays ON after app refresh — saves isOnline to localStorage
//      ("maavu_location_online"). On mount, if the flag is true AND a token
//      exists → auto-resumes tracking silently. User never has to re-tap.
//   2. Removed the goOffline() call on mount that was resetting location
//      every time the page refreshed (this was the root cause of #1 failing).
//   3. GPS updates sent to backend every 2 seconds (changed from 30s) so
//      the admin Live Map shows real vehicle-style smooth movement.
//      watchPosition fires on every GPS change (maximumAge:0). UI state
//      updates on every GPS event. Backend gets pinged every 2 seconds via
//      the interval — this balances smooth tracking vs server load.

import { createContext, useContext, useRef, useState, useEffect } from "react";
import { updateLocation, goOffline } from "../api/locationApi";
import axiosInstance from "../api/axiosInstance";

const LocationContext = createContext(null);

// localStorage key that persists the "online" state across refreshes
const ONLINE_KEY = "maavu_location_online";

export function LocationProvider({ children }) {
  const [isOnline, setIsOnline]               = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError]     = useState("");
  const [onlineSince, setOnlineSince]         = useState(null);
  const watchIdRef  = useRef(null);
  const intervalRef = useRef(null);
  const lastPosRef  = useRef(null); // last known position for the 2s ping

  // ── INTERNAL: start the 2-second backend ping ─────────────
  const startPing = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (watchIdRef.current === null) return;
      if (lastPosRef.current) {
        const { lat, lng, accuracy } = lastPosRef.current;
        updateLocation(lat, lng, accuracy);
      } else {
        // No watchPosition update yet — ask for a fresh position
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            lastPosRef.current = { lat: latitude, lng: longitude, accuracy: Math.round(accuracy) };
            setCurrentLocation(lastPosRef.current);
            updateLocation(latitude, longitude, Math.round(accuracy));
          },
          () => {},
          { enableHighAccuracy: true, timeout: 3000, maximumAge: 2000 }
        );
      }
    }, 2000); // ping backend every 2 seconds
  };

  // ── START TRACKING ─────────────────────────────────────────
  const startTracking = () => {
    if (!navigator.geolocation) { setLocationError("GPS not supported."); return; }
    if (watchIdRef.current !== null) return;
    setLocationError("");

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const loc = { lat: latitude, lng: longitude, accuracy: Math.round(accuracy) };
        lastPosRef.current = loc;
        setCurrentLocation(loc); // updates UI instantly on every GPS change
      },
      (err) => {
        if (err.code === 1) {
          setLocationError("Location permission denied. Please enable GPS.");
          stopTracking(); // eslint-disable-line no-use-before-define
        }
      },
      { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
      // maximumAge:0 → always fresh GPS, no cached positions
      // timeout:3000 → try every 3s if GPS is slow
    );

    watchIdRef.current = id;
    setIsOnline(true);
    setOnlineSince(new Date());
    localStorage.setItem(ONLINE_KEY, "true"); // persist across refresh
    startPing();
  };

  // ── STOP TRACKING ──────────────────────────────────────────
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    lastPosRef.current  = null;
    setIsOnline(false);
    setCurrentLocation(null);
    setOnlineSince(null);
    localStorage.removeItem(ONLINE_KEY); // clear persistence flag
    goOffline();
  };

  // ── ON MOUNT: auto-resume if employee was online before refresh ──
  useEffect(() => {
    const wasOnline   = localStorage.getItem(ONLINE_KEY) === "true";
    const hasToken    = !!localStorage.getItem("maavu_token");

    if (wasOnline && hasToken) {
      // Employee refreshed the page while tracking — silently resume
      startTracking();
    }
    // Note: if NOT previously online, do nothing. Employee must manually
    // tap "Go Online". We do NOT call goOffline() here anymore because
    // that was resetting tracking on every page refresh.

    // ── App close → mark offline via sendBeacon ────────────────
    const handlePageHide = () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      clearInterval(intervalRef.current);
      // sendBeacon survives page unload (normal fetch gets cancelled)
      const token = localStorage.getItem("maavu_token");
      if (token) {
        const base = axiosInstance.defaults.baseURL || "";
        if (navigator.sendBeacon) {
          navigator.sendBeacon(`${base}/api/location/offline`);
        }
        // Remove the persistence flag so app opens as offline next time
        localStorage.removeItem(ONLINE_KEY);
      }
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      clearInterval(intervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getOnlineDuration = () => {
    if (!onlineSince) return "";
    const ms = Date.now() - onlineSince.getTime();
    const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m online` : `${m}m online`;
  };

  return (
    <LocationContext.Provider value={{
      isOnline, currentLocation, locationError,
      onlineSince, startTracking, stopTracking, getOnlineDuration,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside LocationProvider");
  return ctx;
}