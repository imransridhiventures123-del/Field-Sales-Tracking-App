// FILE: src/pages/ProfilePage.jsx
// OWNER: Imran

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "??";

  const menuItems = [
    { label: "Personal Information", icon: "👤" },
    { label: "Change Password",      icon: "🔒" },
    { label: "App Settings",         icon: "⚙️" },
    { label: "Help & Support",       icon: "💬" },
    { label: "About App",            icon: "ℹ️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-600 px-4 pt-6 pb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-lg font-bold">Profile</h1>
          <button onClick={() => navigate("/dashboard")} className="text-blue-200 text-sm">Home</button>
        </div>
      </div>

      {/* Avatar card — overlapping header */}
      <div className="px-4 -mt-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-base">{user?.name || "Employee"}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.role || "Field Sales Executive"}</p>
            <p className="text-xs text-gray-400">ID: {user?.employeeId || user?._id || "—"}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {menuItems.map((item, idx) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-4 text-sm text-gray-700 active:bg-gray-50 transition text-left ${
                idx < menuItems.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 py-4 bg-red-50 border border-red-100 text-red-600 font-semibold rounded-2xl active:scale-95 transition text-sm"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}