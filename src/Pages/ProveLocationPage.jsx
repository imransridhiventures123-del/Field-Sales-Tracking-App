// FILE: src/pages/VisitSummaryPage.jsx
// OWNER: Naveen

import { useNavigate } from "react-router-dom";

export default function VisitSummaryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Visit Completed!</h1>
      <p className="text-gray-400 text-sm mb-8">Great job! Keep it up 💪</p>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={() => navigate("/my-visits")}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold text-sm active:scale-95 transition"
        >
          View My Visits
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold text-sm active:scale-95 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}