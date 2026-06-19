// FILE: src/pages/ProveLocationPage.jsx
// OWNER: Naveen
// PURPOSE: Step 2 of 3 — capture GPS location before photos

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVisit } from "../context/VisitContext";

export default function ProveLocationPage() {
  const navigate = useNavigate();
  const { updateVisitForm } = useVisit();

  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetLocation = () => {
    setError(null);
    setLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this device.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoords({ latitude, longitude, accuracy });
        setLoading(false);
      },
      (err) => {
        setError(
          err.code === 1
            ? "Location permission denied. Please allow location access."
            : "Could not get your location. Try again."
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleContinue = () => {
    if (!coords) return;
    updateVisitForm({
      latitude: coords.latitude,
      longitude: coords.longitude,
      locationAccuracy: coords.accuracy,
    });
    navigate("/upload-photos");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-blue-500 transition" aria-label="Go back">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-semibold">Prove Location</h1>
          <p className="text-xs text-blue-200">Step 2 of 3 — GPS Location</p>
        </div>
      </div>

      {/* STEP PROGRESS */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 border-b border-gray-100">
        <div className="w-8 h-1.5 rounded-full bg-blue-600" />
        <div className="w-8 h-1.5 rounded-full bg-blue-600" />
        <div className="w-8 h-1.5 rounded-full bg-gray-200" />
        <span className="ml-2 text-xs text-gray-400">Shop Info → Location → Photos</span>
      </div>

      <div className="px-4 pt-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-1">Confirm Your Location</h2>
        <p className="text-sm text-gray-400 mb-6 max-w-xs">
          We need your GPS location to verify this shop visit.
        </p>

        {coords ? (
          <div className="bg-white border border-green-200 rounded-2xl p-4 mb-6 w-full max-w-xs">
            <p className="text-xs text-green-700 font-semibold mb-1">✓ Location Captured</p>
            <p className="text-xs text-gray-500">
              {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">Accuracy: ±{Math.round(coords.accuracy)}m</p>
          </div>
        ) : (
          <button
            onClick={handleGetLocation}
            disabled={loading}
            className="w-full max-w-xs py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-2xl transition mb-3"
          >
            {loading ? "Getting Location..." : "📍 Get My Location"}
          </button>
        )}

        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

        {coords && (
          <button
            onClick={handleGetLocation}
            className="text-xs text-blue-600 font-medium mb-6"
          >
            Re-fetch location
          </button>
        )}
      </div>

      {/* CONTINUE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <button
          onClick={handleContinue}
          disabled={!coords}
          className={`w-full py-4 rounded-xl text-white font-semibold text-base transition
            ${!coords ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}
        >
          Continue to Photos →
        </button>
      </div>
    </div>
  );
}