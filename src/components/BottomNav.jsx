// FILE: src/components/BottomNav.jsx
// OWNER: Imran
// PURPOSE: Fixed bottom tab bar — Home, Visits, Target, Profile
// Only shows when user is logged in (not on login page)

import { useNavigate, useLocation } from "react-router-dom";

const TABS = [
  {
    label: "Home",
    path: "/dashboard",
    icon: (active) => (
      <svg className={`w-6 h-6 ${active ? "text-blue-600" : "text-gray-400"}`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    ),
  },
  {
    label: "Visits",
    path: "/my-visits",
    icon: (active) => (
      <svg className={`w-6 h-6 ${active ? "text-blue-600" : "text-gray-400"}`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    ),
  },
  {
    label: "Target",
    path: "/daily-target",
    icon: (active) => (
      <svg className={`w-6 h-6 ${active ? "text-blue-600" : "text-gray-400"}`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "/profile",
    icon: (active) => (
      <svg className={`w-6 h-6 ${active ? "text-blue-600" : "text-gray-400"}`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    ),
  },
];

// Pages where BottomNav should NOT appear
const HIDDEN_ON = ["/login", "/register", "/visit-shop", "/prove-location", "/upload-photos", "/visit-summary"];

export default function BottomNav() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const path      = location.pathname;

  // Hide on login and visit flow pages
  if (HIDDEN_ON.some((p) => path.startsWith(p))) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {TABS.map((tab) => {
          const active = path === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition active:scale-90"
            >
              {tab.icon(active)}
              <span className={`text-[10px] font-medium ${active ? "text-blue-600" : "text-gray-400"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}