// FILE: src/context/LocationContext.jsx — OWNER: Imran
//
// BEHAVIOUR:
//   - Location sirf tab band hoti hai jab employee manually "Go Offline" tap kare
//   - Refresh hone pe → auto-resume (localStorage flag survive karta hai)
//   - App close/reopen pe → auto-resume (localStorage flag survive karta hai)
//   - App close pe goOffline() nahi call hoti — backend ko offline nahi batate
//     (employee jab dobara khole, 2-3 sec mein location phir share hogi)
//
// LIMITATION (browser ka rule, change nahi ho sakta):
//   Jab app bilkul band hai (process dead), JavaScript nahi chalta.
//   GPS ping send nahi ho sakti. Admin ko short gap dikhega.
//   Yeh sirf native app (Android/iOS) mein possible hai, browser mein nahi.
//   Lekin app reopen hone pe auto-resume instantly hota hai.

import { createContext, useContext, useRef, useState, useEffect } from "react";
import { updateLocation, goOffline } from "../api/locationApi";

const LocationContext = createContext(null);

// localStorage use karo — app close ke baad bhi survive karta hai
const ONLINE_KEY = "maavu_location_online";

export function LocationProvider({ children }) {
  const [isOnline, setIsOnline]               = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError]     = useState("");
  const [onlineSince, setOnlineSince]         = useState(null);
  const watchIdRef  = useRef(null);
  const intervalRef = useRef(null);
  const lastPosRef  = useRef(null);

  // ── 2-second backend ping ──────────────────────────────────
  const startPing = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (watchIdRef.current === null) return;
      if (lastPosRef.current) {
        const { lat, lng, accuracy } = lastPosRef.current;
        updateLocation(lat, lng, accuracy);
      } else {
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
    }, 2000);
  };

  // ── START TRACKING ─────────────────────────────────────────
  const startTracking = () => {
    if (!navigator.geolocation) { setLocationError("GPS not supported."); return; }
    if (watchIdRef.current !== null) return; // pehle se chal raha hai
    setLocationError("");

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const loc = { lat: latitude, lng: longitude, accuracy: Math.round(accuracy) };
        lastPosRef.current = loc;
        setCurrentLocation(loc);
      },
      (err) => {
        if (err.code === 1) {
          setLocationError("Location permission denied. Please enable GPS.");
          stopTracking(); // eslint-disable-line no-use-before-define
        }
      },
      { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
    );

    watchIdRef.current = id;
    setIsOnline(true);
    setOnlineSince(new Date());
    localStorage.setItem(ONLINE_KEY, "true"); // localStorage — app close ke baad bhi rehta hai
    startPing();
  };

  // ── STOP TRACKING (sirf manual button pe) ─────────────────
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
    localStorage.removeItem(ONLINE_KEY); // flag hata do — manual offline
    goOffline(); // sirf yahan backend ko batao offline
  };

  // ── ON MOUNT: auto-resume ──────────────────────────────────
  useEffect(() => {
    const wasOnline = localStorage.getItem(ONLINE_KEY) === "true";
    const hasToken  = !!localStorage.getItem("maavu_token");

    if (wasOnline && hasToken) {
      // Refresh ya app reopen — silently resume karo
      startTracking();
    }

    // Cleanup jab React component unmount ho (tab close in browser)
    // NOTE: pagehide pe goOffline() nahi call karte — close pe offline nahi jaana
    return () => {
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