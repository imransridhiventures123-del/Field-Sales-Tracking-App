// FILE: src/pages/VisitDetailPage.jsx
// OWNER: Naveen

import { useNavigate, useParams } from "react-router-dom";

const DUMMY_VISITS = {
  "1": { _id: "1", shopName: "Annas Provision Store", shopCode: "AP001", ownerName: "Annas", mobile: "9876543210", shopType: "Grocery", address: "123 Main St, Chennai", categories: ["Grocery", "Provisions"], status: "Completed", latitude: 13.0827, longitude: 80.2707, photos: [], createdAt: new Date().toISOString() },
  "2": { _id: "2", shopName: "Big Bazaar", shopCode: "BB001", ownerName: "Ravi", mobile: "9876543211", shopType: "Supermarket", address: "456 Anna Salai, Chennai", categories: ["Beverages"], status: "Pending", latitude: 13.0569, longitude: 80.2425, photos: [], createdAt: new Date(Date.now() - 3600000).toISOString() },
};

export default function VisitDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const visit = DUMMY_VISITS[id];

  if (!visit) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Visit not found.
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
            ["Shop Type", visit.shopType],
            ["Address", visit.address],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-400">{label}</span>
              <span className="text-gray-900 font-medium text-right max-w-[55%]">{value}</span>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Categories</p>
          <div className="flex flex-wrap gap-2">
            {visit.categories.map((c) => (
              <span key={c} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{c}</span>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Location</p>
          <p className="text-sm text-gray-700 font-mono">
            {visit.latitude?.toFixed(6)}, {visit.longitude?.toFixed(6)}
          </p>
        </div>

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