// FILE: src/pages/ProfilePage.jsx
// OWNER: Imran — shows real registered user data

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate("/login"); };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const infoRows = [
    { label: "Employee ID",  value: user?.employeeId },
    { label: "Mobile",       value: user?.mobile ? `+91 ${user.mobile}` : "—" },
    { label: "Date of Birth",value: user?.dob ? new Date(user.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
    { label: "Age",          value: user?.age ? `${user.age} years` : "—" },
    { label: "Address",      value: user?.address },
    { label: "Aadhaar",      value: user?.aadhaar ? `XXXX XXXX ${user.aadhaar.replace(/\s/g,"").slice(-4)}` : "—" },
    { label: "PAN",          value: user?.pan || "—" },
    { label: "Salary",       value: user?.salary ? `₹${Number(user.salary).toLocaleString("en-IN")}/month` : "—" },
    { label: "Joined",       value: user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Blue header */}
      <div className="bg-blue-600 px-4 pt-10 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-lg font-bold">My Profile</h1>
          <button onClick={() => navigate("/dashboard")} className="text-blue-200 text-sm">
            Home
          </button>
        </div>
      </div>

      {/* Profile card — overlaps header */}
      <div className="px-4 -mt-14">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-blue-50 p-5">
          <div className="flex items-center gap-4">
            {/* Photo or initials */}
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-blue-100 flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md shadow-blue-200">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 text-base truncate">{user?.name || "Employee"}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{user?.role || "Field Sales Executive"}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-xs font-mono text-blue-700 font-medium">{user?.employeeId || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="px-4 mt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Personal & Work Details
        </p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {infoRows.filter(r => r.value).map((row, idx) => (
            <div key={row.label}
              className={`flex justify-between items-start px-4 py-3.5 ${
                idx < infoRows.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <span className="text-xs text-gray-400 flex-shrink-0 w-28">{row.label}</span>
              <span className="text-xs text-gray-900 font-medium text-right flex-1 ml-2">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {[
            { label: "Change Password" },
            { label: "App Settings" },
            { label: "Help & Support"},
            { label: "About App"},
          ].map((item, idx, arr) => (
            <button key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-4 text-sm text-gray-700 active:bg-gray-50 transition text-left ${
                idx < arr.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-4 py-4 bg-red-50 border border-red-100 text-red-600 font-semibold rounded-2xl active:scale-95 transition text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}