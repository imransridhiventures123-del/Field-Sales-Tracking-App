// FILE: src/components/ShopVisitCard.jsx
// OWNER: Naveen
// CHANGES: removed categories, added fieldType + followUp status

import { useNavigate } from "react-router-dom";

export default function ShopVisitCard({ visit, followupLabel, isFollowupToday, isFollowupUpcoming }) {
  const navigate = useNavigate();

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  const statusStyle = {
    Completed: "bg-green-50 text-green-600",
    Pending:   "bg-amber-50 text-amber-600",
    Rejected:  "bg-red-50 text-red-600",
  };

  const fieldTypeStyle = {
    "Field Sales": "bg-blue-50 text-blue-600",
    "Collection":  "bg-purple-50 text-purple-600",
  };

  return (
    <div
      onClick={() => navigate(`/visit-detail/${visit._id}`)}
      className={`bg-white rounded-2xl border p-4 shadow-sm active:scale-[0.98] transition cursor-pointer
        ${isFollowupToday ? "border-amber-300 shadow-amber-100" : "border-gray-100"}`}
    >
      {/* Today follow-up highlight bar */}
      {isFollowupToday && (
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5 mb-3">
          <span className="text-sm">🔔</span>
          <p className="text-xs font-semibold text-amber-700">Follow-up due today!</p>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{visit.shopName}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{visit.shopCode} · {visit.ownerName}</p>
        </div>
        {/* Status badge */}
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ml-2 flex-shrink-0 ${
          statusStyle[visit.status] || "bg-gray-50 text-gray-500"
        }`}>
          {visit.status}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">

        {/* Field type badge */}
        {visit.fieldType && (
          <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${
            fieldTypeStyle[visit.fieldType] || "bg-gray-50 text-gray-500"
          }`}>
            {visit.fieldType}
          </span>
        )}

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
            {visit.photos.length}
          </div>
        )}
      </div>

      {/* Follow-up row */}
      {visit.followUp?.needed && (
        <div className={`flex items-center gap-2 mt-3 pt-3 border-t ${
          isFollowupToday ? "border-amber-100" : "border-gray-50"
        }`}>
          <svg className={`w-3.5 h-3.5 flex-shrink-0 ${
            isFollowupToday ? "text-amber-500" : "text-gray-400"
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p className={`text-xs font-medium ${
            isFollowupToday ? "text-amber-600" : "text-gray-400"
          }`}>
            Follow-up: {followupLabel || (visit.followUp.date
              ? new Date(visit.followUp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
              : "Scheduled"
            )}
          </p>
        </div>
      )}

    </div>
  );
}