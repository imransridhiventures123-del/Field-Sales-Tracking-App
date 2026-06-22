// FILE: src/pages/MyVisitsPage.jsx — OWNER: Naveen
// CHANGE: Replaced "All / Completed / Pending / Rejected" tabs (useless
// because all recorded visits have status=Completed) with practical tabs:
//   All          → every visit
//   Field Sales  → fieldType === "Field Sales"
//   Collection   → fieldType === "Collection"
//   Follow-up    → visits that have an active follow-up scheduled

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShopVisitCard from "../components/ShopVisitCard";
import { getMyVisits } from "../api/visitApi";

const TABS = [
  { key: "All",         label: "All" },
  { key: "Field Sales", label: "Field Sales" },
  { key: "Collection",  label: "Collection" },
  { key: "Follow-up",   label: "Follow-up" },
];

function isTodayFollowup(visit) {
  if (!visit.followUp?.needed || !visit.followUp?.date) return false;
  return visit.followUp.date === new Date().toISOString().split("T")[0];
}

function hasActiveFollowup(visit) {
  return !!(visit.followUp?.needed && visit.followUp?.status);
}

export default function MyVisitsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [visits, setVisits]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [todayFollowups, setTodayFollowups] = useState([]);
  const [showFollowupBanner, setShowFollowupBanner] = useState(true);

  useEffect(() => {
    const loadVisits = async () => {
      setLoading(true);
      try {
        const res = await getMyVisits();
        const data = res.visits || [];
        setVisits(data);
        setTodayFollowups(data.filter(isTodayFollowup));
      } catch (err) {
        console.error("Failed to load visits:", err);
      } finally {
        setLoading(false);
      }
    };
    loadVisits();
  }, []);

  const filtered = visits.filter((v) => {
    if (activeTab === "All") return true;
    if (activeTab === "Follow-up") return hasActiveFollowup(v);
    return v.fieldType === activeTab;
  });

  // Count per tab (for badge numbers)
  const counts = {
    "All":        visits.length,
    "Field Sales": visits.filter((v) => v.fieldType === "Field Sales").length,
    "Collection":  visits.filter((v) => v.fieldType === "Collection").length,
    "Follow-up":   visits.filter(hasActiveFollowup).length,
  };

  const formatFollowupDate = (dateStr) => {
    if (!dateStr) return "";
    const today    = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    if (dateStr === today)    return "Today";
    if (dateStr === tomorrow) return "Tomorrow";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate("/dashboard")} className="p-1 rounded-full hover:bg-blue-500 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-base font-semibold">My Visits</h1>
        {todayFollowups.length > 0 && (
          <div className="ml-auto flex items-center gap-1.5 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
            🔔 {todayFollowups.length} today
          </div>
        )}
      </div>

      {/* Today's follow-up reminder banner */}
      {todayFollowups.length > 0 && showFollowupBanner && (
        <div className="mx-4 mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔔</span>
              <p className="text-sm font-semibold text-amber-800">
                {todayFollowups.length} Follow-up{todayFollowups.length > 1 ? "s" : ""} Due Today
              </p>
            </div>
            <button onClick={() => setShowFollowupBanner(false)} className="text-amber-400 hover:text-amber-600 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {todayFollowups.map((visit) => (
              <div key={visit._id} onClick={() => navigate(`/visit-detail/${visit._id}`)}
                className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-amber-100 cursor-pointer active:scale-[0.98] transition">
                <div>
                  <p className="text-xs font-semibold text-gray-900">{visit.shopName}</p>
                  <p className="text-[10px] text-gray-400">{visit.ownerName} · {visit.fieldType}</p>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                  Follow up now
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition flex-shrink-0 ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500 border border-gray-200"
              }`}>
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-white/30 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Visit list */}
      <div className="px-4 mt-3 space-y-3">
        {loading ? (
          [1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-2"/>
              <div className="h-3 bg-gray-100 rounded w-1/3"/>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-gray-400">
              {activeTab === "All" ? "No visits recorded yet." : `No ${activeTab} visits yet.`}
            </p>
          </div>
        ) : (
          filtered.map((visit) => (
            <div key={visit._id} onClick={() => navigate(`/visit-detail/${visit._id}`)}
              className="cursor-pointer">
              <ShopVisitCard visit={visit} />
              {visit.followUp?.date && (
                <div className="mt-1 flex items-center gap-1.5 px-1">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p className="text-[10px] text-gray-400">
                    Follow-up: {formatFollowupDate(visit.followUp.date)}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}