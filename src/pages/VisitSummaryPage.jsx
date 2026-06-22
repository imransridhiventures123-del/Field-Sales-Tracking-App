// FILE: src/pages/VisitSummaryPage.jsx
// OWNER: Naveen
// UPDATED: Added "End of Day Report" button

import { useNavigate } from "react-router-dom";

export default function VisitSummaryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">

      {/* Success icon */}
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Visit Completed!</h1>
      <p className="text-gray-400 text-sm mb-8">Great job! Keep it up 💪</p>

      <div className="w-full max-w-xs space-y-3">

        {/* Start another visit */}
        <button
          onClick={() => navigate("/visit-shop")}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold text-sm active:scale-95 transition"
        >
          + Start Another Visit
        </button>

        {/* End of Day — assign to telecaller */}
        <button
          onClick={() => navigate("/end-of-day")}
          className="w-full py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-2xl font-semibold text-sm active:scale-95 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          End of Day — Send Report
        </button>

        {/* View all visits */}
        <button
          onClick={() => navigate("/my-visits")}
          className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold text-sm active:scale-95 transition"
        >
          View My Visits
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-400 py-2"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}