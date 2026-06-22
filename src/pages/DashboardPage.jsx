// FILE: src/pages/DashboardPage.jsx
// CHANGE: Replaced FAKE_STATS and FAKE_RECENT with real API calls.
// CHANGE: Location tracking now uses LocationContext (persistent across
// page navigation) instead of local useRef/useState — so the employee
// stays Online on the admin map even when visiting other pages.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import ShopVisitCard from "../components/ShopVisitCard";
import axiosInstance from "../api/axiosInstance";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function OfflineModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center px-4 pb-8">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Go Offline?</h3>
        <p className="text-sm text-gray-500 text-center mb-1">Your manager monitors your live location during work hours.</p>
        <p className="text-sm text-amber-600 font-medium text-center mb-6">Going offline will stop sharing your location.</p>
        <button onClick={onConfirm} className="w-full py-3.5 bg-red-500 text-white font-semibold rounded-2xl mb-3 active:scale-95 transition">Go Offline Anyway</button>
        <button onClick={onCancel} className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-2xl active:scale-95 transition">Stay Online ✓</button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats]               = useState(null);
  const [recentVisits, setRecentVisits] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  // All location/online state comes from the persistent LocationContext
  const {
    isOnline, currentLocation, locationError,
    startTracking, stopTracking, getOnlineDuration,
  } = useLocation();

  const firstName = user?.name?.split(" ")[0] || "Employee";
  const initials  = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??";
  const weeklyPct = stats ? Math.round((stats.weeklyDone / stats.weeklyTarget) * 100) : 0;

  const todayFollowups = recentVisits.filter(
    (v) => v.followUp?.needed && v.followUp?.date === new Date().toISOString().split("T")[0]
  );

  // ── FETCH REAL DATA FROM BACKEND ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, visitsRes] = await Promise.all([
          axiosInstance.get("/api/visits/stats"),
          axiosInstance.get("/api/visits/my?limit=3"),
        ]);
        setStats(statsRes.data);
        setRecentVisits(visitsRes.data.visits || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = () => { isOnline ? setShowOfflineModal(true) : startTracking(); };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {showOfflineModal && (
        <OfflineModal
          onConfirm={() => { setShowOfflineModal(false); stopTracking(); }}
          onCancel={() => setShowOfflineModal(false)}
        />
      )}

      {/* Header */}
      <div className="bg-blue-600 px-4 pt-10 pb-8">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-blue-200 text-xs">{getGreeting()},</p>
            <h1 className="text-white text-xl font-bold">{firstName} 👋</h1>
          </div>
          <button onClick={() => navigate("/profile")} className="w-11 h-11 rounded-xl overflow-hidden border-2 border-blue-400 flex-shrink-0">
            {user?.photo
              ? <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">{initials}</div>
            }
          </button>
        </div>
        <p className="text-blue-200 text-xs mt-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        {user?.employeeId && (
          <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-500/50 px-2.5 py-1 rounded-full">
            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-xs text-blue-100 font-mono">{user.employeeId}</span>
          </div>
        )}
      </div>

      {/* Online/Offline toggle */}
      <div className="px-4 -mt-5 mb-3">
        <div className={`rounded-2xl p-4 shadow-lg transition-all duration-300 ${isOnline ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-white border border-gray-100"}`}>
          <div className="flex items-center justify-between">
            <div>
              {isOnline ? (
                <>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <p className="text-white font-bold text-base">You're Online</p>
                  </div>
                  <p className="text-green-100 text-xs">Sharing live location with manager</p>
                  {isOnline && <p className="text-green-200 text-[10px] mt-0.5 font-mono">{getOnlineDuration()}</p>}
                  {currentLocation && <p className="text-green-200 text-[10px] mt-0.5">±{currentLocation.accuracy}m accuracy</p>}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    <p className="text-gray-700 font-bold text-base">You're Offline</p>
                  </div>
                  <p className="text-gray-400 text-xs">Tap to go online & share location</p>
                  {locationError && <p className="text-red-500 text-[10px] mt-0.5">{locationError}</p>}
                </>
              )}
            </div>
            <button onClick={handleToggle} className={`relative w-16 h-8 rounded-full transition-all duration-300 flex-shrink-0 ${isOnline ? "bg-white/30" : "bg-gray-200"}`}>
              <div className={`absolute top-1 w-6 h-6 rounded-full shadow-md transition-all duration-300 bg-white ${isOnline ? "left-9" : "left-1"}`} />
            </button>
          </div>
          {isOnline && currentLocation && (
            <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2">
              <div className="relative"><div className="w-2 h-2 bg-white rounded-full" /><div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping opacity-75" /></div>
              <p className="text-white text-xs font-mono">{currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Follow-up reminder */}
      {todayFollowups.length > 0 && (
        <div className="mx-4 mb-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🔔</span>
            <p className="text-sm font-semibold text-amber-800">{todayFollowups.length} Follow-up{todayFollowups.length > 1 ? "s" : ""} Due Today</p>
            <button onClick={() => navigate("/my-visits")} className="ml-auto text-xs text-amber-600 font-semibold underline">View all</button>
          </div>
          {todayFollowups.map((v) => (
            <div key={v._id} onClick={() => navigate(`/visit-detail/${v._id}`)}
              className="bg-white rounded-xl px-3 py-2.5 border border-amber-100 mb-1.5 cursor-pointer active:scale-[0.98] transition last:mb-0">
              <p className="text-xs font-semibold text-gray-900">{v.shopName}</p>
              <p className="text-[10px] text-amber-600 font-medium mt-0.5">Follow up now →</p>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Today's Visits</p>
          {loading ? <div className="h-8 bg-gray-100 rounded animate-pulse" /> : <p className="text-3xl font-bold text-blue-600">{stats?.todayVisits || 0}</p>}
          <p className="text-xs text-gray-400 mt-1">shops visited</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Total Visits</p>
          {loading ? <div className="h-8 bg-gray-100 rounded animate-pulse" /> : <p className="text-3xl font-bold text-gray-800">{stats?.totalVisits || 0}</p>}
          <p className="text-xs text-gray-400 mt-1">all time</p>
        </div>
      </div>

      <div className="px-4 mt-3 space-y-4">
        {/* Weekly target */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-gray-700">Weekly Target</p>
            {!loading && <span className="text-xs font-medium text-blue-600">{stats?.weeklyDone || 0}/{stats?.weeklyTarget || 100} visits</span>}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-700" style={{ width: loading ? "0%" : `${weeklyPct}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs text-gray-400">{loading ? "..." : `${weeklyPct}% complete`}</p>
            <p className="text-xs text-gray-400">{loading ? "..." : `${(stats?.weeklyTarget || 100) - (stats?.weeklyDone || 0)} remaining`}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate("/visit-shop")} className="bg-blue-600 rounded-2xl p-4 text-left active:scale-95 transition">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <p className="text-white font-semibold text-sm">Start Visit</p>
            <p className="text-blue-200 text-xs mt-0.5">Log a shop visit</p>
          </button>

          <button onClick={() => navigate("/my-visits")} className="bg-white rounded-2xl border border-gray-100 p-4 text-left active:scale-95 transition shadow-sm">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <p className="text-gray-800 font-semibold text-sm">My Visits</p>
            <p className="text-gray-400 text-xs mt-0.5">View history</p>
          </button>

          <button onClick={() => navigate("/daily-target")} className="bg-white rounded-2xl border border-gray-100 p-4 text-left active:scale-95 transition shadow-sm">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <p className="text-gray-800 font-semibold text-sm">Daily Target</p>
            <p className="text-gray-400 text-xs mt-0.5">Track progress</p>
          </button>

          <button onClick={() => navigate("/end-of-day")} className="bg-white rounded-2xl border-2 border-orange-200 p-4 text-left active:scale-95 transition shadow-sm">
            <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <p className="text-gray-800 font-semibold text-sm">End of Day</p>
            <p className="text-orange-400 text-xs mt-0.5">Send report</p>
          </button>

          <button onClick={() => navigate("/performance")} className="col-span-2 bg-white rounded-2xl border border-gray-100 p-4 text-left active:scale-95 transition shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <div>
              <p className="text-gray-800 font-semibold text-sm">Performance Ledger</p>
              <p className="text-gray-400 text-xs mt-0.5">Track collections & sales margin</p>
            </div>
          </button>
        </div>

        {/* Recent Visits */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recent Visits</p>
          <button onClick={() => navigate("/my-visits")} className="text-xs text-blue-600 font-medium">See all →</button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : recentVisits.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            No visits yet. Tap "Start Visit" to log your first visit!
          </div>
        ) : (
          <div className="space-y-3">
            {recentVisits.map((visit) => <ShopVisitCard key={visit._id} visit={visit} />)}
          </div>
        )}
      </div>
    </div>
  );
}