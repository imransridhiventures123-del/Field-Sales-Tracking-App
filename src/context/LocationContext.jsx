// FILE: src/context/LocationContext.jsx
// OWNER: Imran
// CHANGE: Two fixes for the "closed app still shows online" problem:
//   1. On mount: call goOffline() immediately to clear any stale
//      "online" status left from the previous session (handles app crash,
//      phone battery death, or force-close without tapping Go Offline).
//   2. pagehide listener: fires when the browser tab / PWA is fully
//      closed or put to background on iOS — calls goOffline() so the
//      backend is updated immediately when the app closes.
//   Note: navigator.sendBeacon is used in pagehide because normal fetch/
//   axios is cancelled when the page unloads; sendBeacon survives it.

import { createContext, useContext, useRef, useState, useEffect } from "react";
import { updateLocation, goOffline } from "../api/locationApi";
import axiosInstance from "../api/axiosInstance";

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [isOnline, setIsOnline]               = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError]     = useState("");
  const [onlineSince, setOnlineSince]         = useState(null);
  const watchIdRef  = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // ── FIX 1: Reset any stale online status on app open ──────
    // If the employee closed the app last time without tapping "Go Offline",
    // the backend still has isOnline: true. Reset it silently on every open.
    goOffline();

    // ── FIX 2: Mark offline when app / tab is fully closed ────
    // pagehide fires on iOS Safari (visibilitychange is unreliable there).
    // sendBeacon survives page unload — regular fetch gets cancelled.
    const handlePageHide = () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      clearInterval(intervalRef.current);
      // sendBeacon keeps the request alive after the page dies
      const token = localStorage.getItem("maavu_token");
      if (token) {
        const base = axiosInstance.defaults.baseURL || "";
        navigator.sendBeacon
          ? navigator.sendBeacon(`${base}/api/location/offline`)
          : goOffline(); // fallback for browsers without sendBeacon
      }
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) { setLocationError("GPS not supported."); return; }
    if (watchIdRef.current !== null) return;
    setLocationError("");

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setCurrentLocation({ lat: latitude, lng: longitude, accuracy: Math.round(accuracy) });
        updateLocation(latitude, longitude, Math.round(accuracy));
      },
      (err) => {
        if (err.code === 1) {
          setLocationError("Location permission denied.");
          stopTracking(); // eslint-disable-line no-use-before-define
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    watchIdRef.current = id;
    setIsOnline(true);
    setOnlineSince(new Date());

    // Keep-alive ping every 30s — some phones pause watchPosition when
    // the screen turns off (common on Android battery saver mode)
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (watchIdRef.current === null) return;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setCurrentLocation({ lat: latitude, lng: longitude, accuracy: Math.round(accuracy) });
          updateLocation(latitude, longitude, Math.round(accuracy));
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    }, 30000);
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsOnline(false);
    setCurrentLocation(null);
    setOnlineSince(null);
    goOffline();
  };

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