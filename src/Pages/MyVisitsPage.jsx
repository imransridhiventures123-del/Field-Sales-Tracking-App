// FILE: src/pages/MyVisitsPage.jsx
// OWNER: Naveen

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopVisitCard from "../components/ShopVisitCard";

const TABS = ["All", "Completed", "Pending", "Rejected"];

const DUMMY_VISITS = [
  { _id: "1", shopName: "Annas Provision Store", shopCode: "AP001", ownerName: "Annas", status: "Completed", categories: ["Grocery"], photos: [1, 2], createdAt: new Date().toISOString() },
  { _id: "2", shopName: "Big Bazaar", shopCode: "BB001", ownerName: "Ravi", status: "Pending", categories: ["Beverages"], photos: [1], createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: "3", shopName: "Sri Murugan Stores", shopCode: "SM001", ownerName: "Murugan", status: "Rejected", categories: ["Grocery"], photos: [], createdAt: new Date(Date.now() - 7200000).toISOString() },
  { _id: "4", shopName: "Kumar Stores", shopCode: "KS001", ownerName: "Kumar", status: "Completed", categories: ["Provisions"], photos: [1], createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export default function MyVisitsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All"
    ? DUMMY_VISITS
    : DUMMY_VISITS.filter((v) => v.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate("/dashboard")} className="p-1 rounded-full hover:bg-blue-500 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-base font-semibold">My Visits</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 flex gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No {activeTab.toLowerCase()} visits</div>
        ) : (
          filtered.map((visit) => <ShopVisitCard key={visit._id} visit={visit} />)
        )}
      </div>
    </div>
  );
}