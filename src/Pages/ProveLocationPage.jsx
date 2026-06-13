import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVisit } from "../context/VisitContext";
import { useGeoLocation } from "../hooks/useGeoLocation";

export default function ProveLocationPage() {
  const navigate = useNavigate();
  const { updateVisitForm } = useVisit();

  const { location, error, loading, getLocation } = useGeoLocation();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const handleConfirm = () => {
    if (!location) return;

    updateVisitForm({
      latitude: location.latitude,
      longitude: location.longitude,
      locationAccuracy: location.accuracy,
      locationTimestamp: new Date().toISOString(),
    });

    setConfirmed(true);
    setTimeout(() => {
      navigate("/upload-photos");
    }, 400);
  };

  const mapUrl = location
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.005},${location.latitude - 0.005},${location.longitude + 0.005},${location.latitude + 0.005}&layer=mapnik&marker=${location.latitude},${location.longitude}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full hover:bg-blue-500 transition"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-semibold">Prove Location</h1>
          <p className="text-xs text-blue-200">Step 2 of 3 — GPS Verification</p>
        </div>
      </div>

      {/* STEP PROGRESS */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 border-b border-gray-100">
        <div className="w-8 h-1.5 rounded-full bg-blue-600" />
        <div className="w-8 h-1.5 rounded-full bg-blue-600" />
        <div className="w-8 h-1.5 rounded-full bg-gray-200" />
        <span className="ml-2 text-xs text-gray-400">Shop Info → Location → Photos</span>
      </div>

      <div className="px-4 pt-4 space-y-4">

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Your Current Location
        </p>

        {/* MAP BOX */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
          {loading && (
            <div className="h-64 flex flex-col items-center justify-center gap-3 bg-gray-50">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Fetching your location...</p>
            </div>
          )}

          {error && (
            <div className="h-64 flex flex-col items-center justify-center gap-3 px-6 text-center bg-red-50">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={getLocation}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"
              >
                Try Again
              </button>
            </div>
          )}

          {location && mapUrl && (
            <iframe
              title="Your location"
              src={mapUrl}
              width="100%"
              height="260"
              style={{ border: 0 }}
              loading="lazy"
            />
          )}
        </div>

        {/* COORDINATES CARD */}
        {location && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Location captured</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Latitude</p>
                <p className="text-sm font-semibold text-gray-800">
                  {location.latitude.toFixed(6)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Longitude</p>
                <p className="text-sm font-semibold text-gray-800">
                  {location.longitude.toFixed(6)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Accuracy</p>
              <p className="text-sm font-semibold text-gray-800">
                ±{Math.round(location.accuracy)} meters
              </p>
            </div>

            <button
              onClick={getLocation}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Location
            </button>
          </div>
        )}

        {/* INFO NOTE */}
        <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
          <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-blue-700 leading-relaxed">
            Your GPS location is recorded as proof that you visited this shop. Make sure you are physically at the shop before confirming.
          </p>
        </div>

      </div>

      {/* CONFIRM BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <button
          onClick={handleConfirm}
          disabled={!location || loading || confirmed}
          className={`w-full py-4 rounded-xl text-white font-semibold text-base transition
            ${!location || loading || confirmed
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
        >
          {confirmed ? "Confirmed!" : !location ? "Waiting for GPS..." : "Confirm Location →"}
        </button>
      </div>

    </div>
  );
}