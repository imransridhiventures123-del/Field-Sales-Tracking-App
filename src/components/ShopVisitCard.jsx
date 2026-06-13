// FILE: src/components/ShopVisitCard.jsx
// OWNER: Naveen
// USED IN: DashboardPage (recent visits) + MyVisitsPage (full list)

import { useNavigate } from "react-router-dom";

export default function ShopVisitCard({ visit }) {
  const navigate = useNavigate();

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div
      onClick={() => navigate(`/visit-detail/${visit._id}`)}
      className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm active:scale-[0.98] transition cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{visit.shopName}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{visit.shopCode} · {visit.ownerName}</p>
        </div>
        {/* Status badge */}
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ml-2 flex-shrink-0 ${
          visit.status === "Rejected"
            ? "bg-red-50 text-red-600"
            : visit.status === "Pending"
            ? "bg-amber-50 text-amber-600"
            : "bg-green-50 text-green-600"
        }`}>
          {visit.status || "Completed"}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-3">
        {/* Time */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {formatTime(visit.createdAt)}
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          {formatDate(visit.createdAt)}
        </div>

        {/* Photos count */}
        {visit.photos?.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {visit.photos.length} photo{visit.photos.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Categories */}
      {visit.categories?.length > 0 && (
        <div className="flex gap-1.5 mt-2.5 flex-wrap">
          {visit.categories.map((cat) => (
            <span key={cat} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              {cat}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}