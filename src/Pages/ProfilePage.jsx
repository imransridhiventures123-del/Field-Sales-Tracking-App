import { useNavigate } from "react-router-dom";

// Fake user data — replace with real AuthContext when Imran's backend is ready
const FAKE_USER = {
  name: "Naveen Kumar",
  email: "naveen@fieldsales.com",
  mobile: "9876543210",
  role: "Sales Executive",
  region: "Chennai South",
  employeeId: "EMP-001",
  joinedAt: "2025-01-15",
  avatar: null, // no photo — will show initials
};

const FAKE_STATS = {
  totalVisits: 87,
  thisMonth: 24,
  thisWeek: 6,
};

export default function ProfilePage() {
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatJoinDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <div className="bg-blue-600 px-4 pt-6 pb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-lg font-semibold">Profile</h1>
        </div>
      </div>

      {/* AVATAR CARD — overlapping header */}
      <div className="px-4 -mt-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">

          {/* Avatar circle */}
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
            {getInitials(FAKE_USER.name)}
          </div>

          <h2 className="text-lg font-bold text-gray-800">{FAKE_USER.name}</h2>
          <p className="text-sm text-blue-600 font-medium">{FAKE_USER.role}</p>
          <p className="text-xs text-gray-400 mt-0.5">{FAKE_USER.region}</p>

          {/* Employee ID badge */}
          <div className="mt-3 px-3 py-1 bg-gray-100 rounded-full">
            <p className="text-xs text-gray-500 font-medium">{FAKE_USER.employeeId}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">

        {/* STATS ROW */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{FAKE_STATS.totalVisits}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{FAKE_STATS.thisMonth}</p>
            <p className="text-xs text-gray-400 mt-0.5">This Month</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{FAKE_STATS.thisWeek}</p>
            <p className="text-xs text-gray-400 mt-0.5">This Week</p>
          </div>
        </div>

        {/* ACCOUNT INFO */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Account Information
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">

          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Full Name</p>
              <p className="text-sm font-medium text-gray-800">{FAKE_USER.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800">{FAKE_USER.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Mobile</p>
              <p className="text-sm font-medium text-gray-800">+91 {FAKE_USER.mobile}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Joined</p>
              <p className="text-sm font-medium text-gray-800">{formatJoinDate(FAKE_USER.joinedAt)}</p>
            </div>
          </div>

        </div>

        {/* APP INFO */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          App
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">

          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-800">Version</p>
            </div>
            <p className="text-sm text-gray-400">1.0.0</p>
          </div>

          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-800">Privacy Policy</p>
            </div>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl border border-red-200 text-red-500 font-semibold text-base active:scale-95 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>

      </div>
    </div>
  );
}