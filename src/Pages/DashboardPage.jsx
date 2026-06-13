import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShopVisitCard from "../components/ShopVisitCard";

// Fake stats — replace with real API when backend ready
const FAKE_STATS = {
  todayVisits: 4,
  weeklyTarget: 30,
  weeklyDone: 18,
  totalVisits: 87,
};

// Fake recent visits — replace with real API when backend ready
const FAKE_RECENT = [
  {
    _id: "1",
    shopName: "Annas Provision Store",
    shopCode: "AP001",
    ownerName: "Annas",
    shopType: "Field Sales",
    categories: ["Grocery", "Provisions"],
    latitude: 13.0827,
    longitude: 80.2707,
    photos: [1, 2],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    shopName: "Big Bazaar",
    shopCode: "BB001",
    ownerName: "Ravi",
    shopType: "Collection",
    categories: ["Beverages"],
    latitude: 13.0569,
    longitude: 80.2425,
    photos: [1],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: "3",
    shopName: "Sri Murugan Stores",
    shopCode: "SM001",
    ownerName: "Murugan",
    shopType: "Field Sales",
    categories: ["Grocery"],
    latitude: 13.0674,
    longitude: 80.2376,
    photos: [],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentVisits, setRecentVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const weeklyProgress = stats
    ? Math.round((stats.weeklyDone / stats.weeklyTarget) * 100)
    : 0;

  // Load fake data — replace with real API when backend ready
  useEffect(() => {
    setTimeout(() => {
      setStats(FAKE_STATS);
      setRecentVisits(FAKE_RECENT);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <div className="bg-blue-600 px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-blue-200 text-xs">Good morning,</p>
            <h1 className="text-white text-xl font-bold">Naveen 👋</h1>
          </div>
          {/* Profile avatar */}
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm"
          >
            NA
          </button>
        </div>
        <p className="text-blue-200 text-xs mt-1">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long", day: "numeric", month: "long"
          })}
        </p>
      </div>

      {/* STATS CARDS — overlapping the header */}
      <div className="px-4 -mt-4 grid grid-cols-2 gap-3">

        {/* Today's Visits */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Today's Visits</p>
          {loading ? (
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-blue-600">{stats.todayVisits}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">shops visited</p>
        </div>

        {/* Total Visits */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Total Visits</p>
          {loading ? (
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-gray-800">{stats.totalVisits}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">all time</p>
        </div>

      </div>

      <div className="px-4 mt-3 space-y-4">

        {/* WEEKLY TARGET CARD */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-gray-700">Weekly Target</p>
            {!loading && (
              <span className="text-xs font-medium text-blue-600">
                {stats.weeklyDone}/{stats.weeklyTarget} visits
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
              style={{ width: loading ? "0%" : `${weeklyProgress}%` }}
            />
          </div>

          <div className="flex justify-between mt-2">
            <p className="text-xs text-gray-400">
              {loading ? "..." : `${weeklyProgress}% complete`}
            </p>
            <p className="text-xs text-gray-400">
              {loading ? "..." : `${stats.weeklyTarget - stats.weeklyDone} remaining`}
            </p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Quick Actions
        </p>

        <div className="grid grid-cols-2 gap-3">

          {/* Start Visit */}
          <button
            onClick={() => navigate("/visit-shop")}
            className="bg-blue-600 rounded-2xl p-4 text-left active:scale-95 transition"
          >
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm">Start Visit</p>
            <p className="text-blue-200 text-xs mt-0.5">Log a shop visit</p>
          </button>

          {/* My Visits */}
          <button
            onClick={() => navigate("/my-visits")}
            className="bg-white rounded-2xl border border-gray-100 p-4 text-left active:scale-95 transition shadow-sm"
          >
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-800 font-semibold text-sm">My Visits</p>
            <p className="text-gray-400 text-xs mt-0.5">View history</p>
          </button>

          {/* Daily Target */}
          <button
            onClick={() => navigate("/daily-target")}
            className="bg-white rounded-2xl border border-gray-100 p-4 text-left active:scale-95 transition shadow-sm"
          >
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-800 font-semibold text-sm">Daily Target</p>
            <p className="text-gray-400 text-xs mt-0.5">Track progress</p>
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="bg-white rounded-2xl border border-gray-100 p-4 text-left active:scale-95 transition shadow-sm"
          >
            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-800 font-semibold text-sm">Profile</p>
            <p className="text-gray-400 text-xs mt-0.5">Your account</p>
          </button>

        </div>

        {/* RECENT VISITS */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Recent Visits
          </p>
          <button
            onClick={() => navigate("/my-visits")}
            className="text-xs text-blue-600 font-medium"
          >
            See all →
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recentVisits.map((visit) => (
              <ShopVisitCard key={visit._id} visit={visit} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}