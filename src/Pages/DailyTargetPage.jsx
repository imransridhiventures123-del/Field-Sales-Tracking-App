import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Fake data — replace with real API when backend ready
const FAKE_TARGET = {
  dailyTarget: 10,
  completed: 4,
  fieldSales: 3,
  collection: 1,
  remaining: 6,
  date: new Date().toISOString(),
};

const FAKE_HOURLY = [
  { hour: "9am", visits: 1 },
  { hour: "10am", visits: 2 },
  { hour: "11am", visits: 0 },
  { hour: "12pm", visits: 1 },
  { hour: "1pm", visits: 0 },
  { hour: "2pm", visits: 0 },
  { hour: "3pm", visits: 0 },
  { hour: "4pm", visits: 0 },
  { hour: "5pm", visits: 0 },
];

const FAKE_RECENT = [
  { _id: "1", shopName: "Annas Provision Store", shopType: "Field Sales", time: "09:15 am" },
  { _id: "2", shopName: "Big Bazaar", shopType: "Field Sales", time: "10:05 am" },
  { _id: "3", shopName: "Sri Murugan Stores", shopType: "Field Sales", time: "10:45 am" },
  { _id: "4", shopName: "Raja Stores", shopType: "Collection", time: "12:10 pm" },
];

export default function DailyTargetPage() {
  const navigate = useNavigate();
  const [target] = useState(FAKE_TARGET);

  const progress = Math.round((target.completed / target.dailyTarget) * 100);
  const maxVisits = Math.max(...FAKE_HOURLY.map((h) => h.visits), 1);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long"
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <div className="bg-blue-600 px-4 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-blue-500 transition"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-white text-lg font-semibold">Daily Target</h1>
            <p className="text-blue-200 text-xs">{today}</p>
          </div>
        </div>
      </div>

      {/* MAIN PROGRESS CARD — overlapping header */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

          {/* Circular progress */}
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                {/* Progress circle */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-bold text-gray-800">{progress}%</p>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <p className="text-xs text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{target.completed}
                  <span className="text-sm text-gray-400 font-normal"> / {target.dailyTarget}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                  {target.fieldSales} Field Sales
                </span>
                <span className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                  {target.collection} Collection
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {target.remaining} visits remaining today
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">

        {/* HOURLY CHART */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Visits by Hour
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-end gap-1.5 h-24">
            {FAKE_HOURLY.map((item) => (
              <div key={item.hour} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end" style={{ height: "72px" }}>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      item.visits > 0 ? "bg-blue-600" : "bg-gray-100"
                    }`}
                    style={{
                      height: item.visits > 0
                        ? `${(item.visits / maxVisits) * 72}px`
                        : "4px",
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400" style={{ fontSize: "9px" }}>{item.hour}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TODAY'S VISITS LIST */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Today's Visits
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {FAKE_RECENT.map((visit, index) => (
            <div
              key={visit._id}
              onClick={() => navigate(`/visit-detail/${visit._id}`)}
              className="flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                {/* Number */}
                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <p className="text-xs font-bold text-blue-600">{index + 1}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{visit.shopName}</p>
                  <p className="text-xs text-gray-400">{visit.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                  ${visit.shopType === "Field Sales"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-purple-50 text-purple-700"
                  }`}>
                  {visit.shopType}
                </span>
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* START VISIT BUTTON */}
        <button
          onClick={() => navigate("/visit-shop")}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-base active:scale-95 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Start New Visit
        </button>

      </div>
    </div>
  );
}