// FILE: src/pages/MyVisitsPage.jsx
// OWNER: Naveen
// UPDATED: Real API — dummy visits removed

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShopVisitCard from "../components/ShopVisitCard";
import { getMyVisits } from "../api/visitApi";

const TABS = ["All", "Completed", "Pending", "Rejected"];

// Check if a visit has a follow-up due today
function isTodayFollowup(visit) {
  if (!visit.followUp?.needed || !visit.followUp?.date) return false;
  const today = new Date().toISOString().split("T")[0];
  return visit.followUp.date === today;
}

// Check if a visit has an upcoming follow-up
function isUpcomingFollowup(visit) {
  if (!visit.followUp?.needed || !visit.followUp?.date) return false;
  const today = new Date().toISOString().split("T")[0];
  return visit.followUp.date > today;
}

export default function MyVisitsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const filtered = activeTab === "All"
    ? visits
    : visits.filter((v) => v.status === activeTab);

  const formatFollowupDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    if (dateStr === today) return "Today";
    if (dateStr === tomorrow) return "Tomorrow";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
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

      {/* TODAY'S FOLLOW-UP REMINDER BANNER */}
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
              <div
                key={visit._id}
                onClick={() => navigate(`/visit-detail/${visit._id}`)}
                className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-amber-100 cursor-pointer active:scale-[0.98] transition"
              >
                <div>
                  <p className="text-xs font-semibold text-gray-900">{visit.shopName}</p>
                  <p className="text-[10px] text-gray-400">{visit.ownerName} · {visit.fieldType}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                    Follow up now
                  </span>
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 flex gap-1 overflow-x-auto mt-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
              activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"
            }`}
          >
            {tab}
            <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === tab ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
            }`}>
              {tab === "All" ? visits.length : visits.filter((v) => v.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Visit list */}
      <div className="px-4 pt-4 space-y-3">
        {loading ? (
          <p className="text-center text-sm text-gray-400 py-10">Loading visits...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-400 text-sm">No {activeTab.toLowerCase()} visits</p>
          </div>
        ) : (
          filtered.map((visit) => (
            <ShopVisitCard
              key={visit._id}
              visit={visit}
              followupLabel={formatFollowupDate(visit.followUp?.date)}
              isFollowupToday={isTodayFollowup(visit)}
              isFollowupUpcoming={isUpcomingFollowup(visit)}
            />
          ))
        )}
      </div>
    </div>
  );
}