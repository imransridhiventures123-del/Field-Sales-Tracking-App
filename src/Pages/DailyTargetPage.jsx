// FILE: src/pages/DailyTargetPage.jsx
// OWNER: Imran

import { useNavigate } from "react-router-dom";

const DUMMY_TARGET = { target: 20, completed: 12, pending: 5, rejected: 3 };

export default function DailyTargetPage() {
  const navigate = useNavigate();
  const { target, completed, pending, rejected } = DUMMY_TARGET;
  const pct = Math.round((completed / target) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate("/dashboard")} className="p-1 rounded-full hover:bg-blue-500 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-base font-semibold">Daily Target</h1>
      </div>

      <div className="px-4 pt-5 space-y-4">

        {/* Big progress circle area */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center shadow-sm">
          <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide font-semibold">Today's Progress</p>

          {/* Simple circular indicator using text */}
          <div className="w-32 h-32 rounded-full border-8 border-blue-100 flex flex-col items-center justify-center mb-4 relative">
            <div className="absolute inset-0 rounded-full border-8 border-blue-600"
              style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }} />
            <span className="text-3xl font-bold text-blue-600">{pct}%</span>
            <span className="text-xs text-gray-400">done</span>
          </div>

          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900 text-lg">{completed}</span> of {target} shops visited
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{completed}</p>
            <p className="text-xs text-green-500 mt-1">Completed</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-500">{pending}</p>
            <p className="text-xs text-amber-500 mt-1">Pending</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-red-500">{rejected}</p>
            <p className="text-xs text-red-400 mt-1">Rejected</p>
          </div>
        </div>

        {/* Remaining */}
        <div className="bg-blue-600 rounded-2xl p-4 text-white text-center">
          <p className="text-xs text-blue-200 mb-1">Remaining Today</p>
          <p className="text-4xl font-bold">{target - completed}</p>
          <p className="text-xs text-blue-200 mt-1">shops left to visit</p>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/visit-shop")}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold active:scale-95 transition"
        >
          + Start a Visit
        </button>

      </div>
    </div>
  );
}