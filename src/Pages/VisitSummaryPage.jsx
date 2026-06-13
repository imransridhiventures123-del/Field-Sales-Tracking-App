import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVisit } from "../context/VisitContext";

export default function VisitSummaryPage() {
  const navigate = useNavigate();
  const { visitForm, resetVisitForm } = useVisit();

  // If someone lands here directly without data, send them back
  useEffect(() => {
    if (!visitForm.shopName) {
      navigate("/visit-shop");
    }
  }, []);

  const handleNewVisit = () => {
    resetVisitForm();
    navigate("/visit-shop");
  };

  const handleGoHome = () => {
    resetVisitForm();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* SUCCESS SECTION */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">

        {/* BIG GREEN TICK */}
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-2">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">Visit Recorded!</h1>
        <p className="text-sm text-gray-500 max-w-xs">
          Your visit to <span className="font-semibold text-gray-700">{visitForm.shopName}</span> has been successfully submitted.
        </p>

        {/* VISIT DETAILS CARD */}
        <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 mt-2 text-left space-y-3">

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Visit Details
          </p>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shop Name</span>
            <span className="font-medium text-gray-800">{visitForm.shopName || "—"}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shop Code</span>
            <span className="font-medium text-gray-800">{visitForm.shopCode || "—"}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Owner</span>
            <span className="font-medium text-gray-800">{visitForm.ownerName || "—"}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mobile</span>
            <span className="font-medium text-gray-800">
              {visitForm.mobile ? `+91 ${visitForm.mobile}` : "—"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Visit Type</span>
            <span className="font-medium text-gray-800">{visitForm.shopType || "—"}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Categories</span>
            <span className="font-medium text-gray-800">
              {visitForm.categories?.length > 0
                ? visitForm.categories.join(", ")
                : "—"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">GPS</span>
            <span className="font-medium text-gray-800">
              {visitForm.latitude
                ? `${visitForm.latitude.toFixed(4)}, ${visitForm.longitude.toFixed(4)}`
                : "—"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Photos</span>
            <span className="font-medium text-gray-800">
              {visitForm.photos?.length > 0
                ? `${visitForm.photos.length} uploaded`
                : "—"}
            </span>
          </div>

          {visitForm.notes ? (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Notes</p>
              <p className="text-sm text-gray-700">{visitForm.notes}</p>
            </div>
          ) : null}

          <div className="pt-2 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-500">Submitted at</span>
            <span className="font-medium text-gray-800">
              {new Date().toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

        </div>
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="px-4 py-6 space-y-3">
        <button
          onClick={handleNewVisit}
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 active:scale-95 transition"
        >
          Start New Visit
        </button>
        <button
          onClick={handleGoHome}
          className="w-full py-4 rounded-xl border border-gray-200 text-gray-600 font-medium text-base hover:bg-gray-50 active:scale-95 transition"
        >
          Go to Dashboard
        </button>
      </div>

    </div>
  );
}