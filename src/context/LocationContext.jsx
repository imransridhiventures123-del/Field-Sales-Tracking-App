// FILE: src/context/LocationContext.jsx
// PURPOSE: Persistent GPS tracking across all pages.
// CHANGE: Location tracking was previously inside DashboardPage.jsx so
// navigating away killed watchPosition and showed "Offline" in admin.
// Now the tracker lives here — wrapping the entire app — so it keeps
// sending GPS updates no matter which page is open. The employee only
// goes offline when they manually tap "Go Offline".

import { createContext, useContext, useRef, useState, useEffect } from "react";
import { updateLocation, goOffline } from "../api/locationApi";

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [isOnline, setIsOnline]               = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError]     = useState("");
  const [onlineSince, setOnlineSince]         = useState(null);
  const watchIdRef  = useRef(null);
  const intervalRef = useRef(null);

  // Clean up when app unmounts (tab closed)
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) { setLocationError("GPS not supported."); return; }
    if (watchIdRef.current !== null) return; // already tracking
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

    // Keep-alive: re-send position every 30s in case watchPosition stalls
    // (common when phone screen turns off on some Android devices)
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