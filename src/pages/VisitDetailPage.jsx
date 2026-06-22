// FILE: src/pages/VisitDetailPage.jsx
// OWNER: Naveen
// CHANGE: Removed DUMMY_VISITS, now fetches the real visit from the backend

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVisitById } from "../api/visitApi";

export default function VisitDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const data = await getVisitById(id);
        setVisit(data.visit);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this visit.");
      } finally {
        setLoading(false);
      }
    };
    fetchVisit();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      Loading visit...
    </div>
  );

  if (error || !visit) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-2 px-4 text-center">
      <p>{error || "Visit not found."}</p>
      <button onClick={() => navigate(-1)} className="text-blue-600 text-sm font-medium">Go back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-blue-500 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-base font-semibold">Visit Details</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Status */}
        <div className={`rounded-2xl px-4 py-3 border ${
          visit.status === "Completed" ? "bg-green-50 border-green-200" :
          visit.status === "Pending" ? "bg-amber-50 border-amber-200" :
          "bg-red-50 border-red-200"
        }`}>
          <span className={`text-sm font-semibold ${
            visit.status === "Completed" ? "text-green-700" :
            visit.status === "Pending" ? "text-amber-700" : "text-red-700"
          }`}>{visit.status}</span>
        </div>

        {/* Shop info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Shop Information</p>
          {[
            ["Shop Name", visit.shopName],
            ["Shop Code", visit.shopCode],
            ["Owner Name", visit.ownerName],
            ["Mobile", visit.mobile],
            ["Field Type", visit.fieldType],
            ["Address", visit.address],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-400">{label}</span>
              <span className="text-gray-900 font-medium text-right max-w-[55%]">{value || "—"}</span>
            </div>
          ))}
        </div>

        {/* Photos */}
        {visit.photos && visit.photos.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Photos</p>
            <div className="grid grid-cols-3 gap-2">
              {visit.photos.map((photo, i) => (
                <a key={i} href={photo.url} target="_blank" rel="noreferrer" className="block">
                  <img src={photo.url} alt={photo.type || "Visit photo"} className="w-full h-24 object-cover rounded-lg border border-gray-100" />
                  <p className="text-[10px] text-gray-400 mt-1 text-center">{photo.type}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {(visit.latitude && visit.longitude) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Location</p>
            <p className="text-sm text-gray-700 font-mono">
              {visit.latitude.toFixed(6)}, {visit.longitude.toFixed(6)}
            </p>
            {visit.locationAccuracy != null && (
              <p className="text-xs text-gray-400 mt-1">±{visit.locationAccuracy}m accuracy</p>
            )}
          </div>
        )}

        {/* Follow-up */}
        {visit.followUp?.needed && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Follow-up</p>
            <p className="text-sm text-amber-800">{visit.followUp.status?.replace("_", " ") || "Follow-up needed"}</p>
            {visit.followUp.date && <p className="text-xs text-amber-600 mt-1">Due: {visit.followUp.date}</p>}
          </div>
        )}

        {/* Notes */}
        {visit.notes && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Notes</p>
            <p className="text-sm text-gray-700">{visit.notes}</p>
          </div>
        )}

        {/* Visit time */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Visit Time</p>
          <p className="text-sm text-gray-800">
            {new Date(visit.createdAt).toLocaleString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
              hour: "2-digit", minute: "2-digit", hour12: true
            })}
          </p>
        </div>
      </div>
    </div>
  );
}