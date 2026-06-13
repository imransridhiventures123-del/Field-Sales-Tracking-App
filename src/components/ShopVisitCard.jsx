import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils/helpers";

export default function ShopVisitCard({ visit, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(visit);
    } else {
      navigate(`/visit-detail/${visit._id}`);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 cursor-pointer active:scale-95 transition"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-800">{visit.shopName}</h3>
          <p className="text-xs text-gray-400">{visit.shopCode} · {visit.ownerName}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0
          ${visit.shopType === "Field Sales"
            ? "bg-blue-100 text-blue-700"
            : "bg-purple-100 text-purple-700"
          }`}>
          {visit.shopType}
        </span>
      </div>

      {visit.categories?.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {visit.categories.map((cat) => (
            <span key={cat} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
              {cat}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-50">
        <div className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(visit.createdAt)} · {formatTime(visit.createdAt)}
        </div>
        <div className="flex items-center gap-2">
          {visit.latitude && (
            <span className="flex items-center gap-0.5 text-green-500">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              GPS
            </span>
          )}
          {visit.photos?.length > 0 && (
            <span className="flex items-center gap-0.5 text-blue-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              {visit.photos.length}
            </span>
          )}
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}