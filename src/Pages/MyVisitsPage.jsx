import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShopVisitCard from "../components/ShopVisitCard";
import { formatDate, formatTime } from "../utils/helpers";


// Fake visit data for testing — remove when backend is ready
const FAKE_VISITS = [
  {
    _id: "1",
    shopName: "Annas Provision Store",
    shopCode: "AP001",
    ownerName: "Annas",
    mobile: "9876543210",
    shopType: "Field Sales",
    categories: ["Grocery", "Provisions"],
    latitude: 13.0827,
    longitude: 80.2707,
    photos: [1, 2],
    notes: "Good shop, interested in new products",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    shopName: "Big Bazaar",
    shopCode: "BB001",
    ownerName: "Ravi",
    mobile: "9123456789",
    shopType: "Collection",
    categories: ["Beverages", "Medical"],
    latitude: 13.0569,
    longitude: 80.2425,
    photos: [1],
    notes: "",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "3",
    shopName: "Sri Murugan Stores",
    shopCode: "SM001",
    ownerName: "Murugan",
    mobile: "9988776655",
    shopType: "Field Sales",
    categories: ["Grocery"],
    latitude: 13.0674,
    longitude: 80.2376,
    photos: [],
    notes: "Follow up next week",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const FILTER_OPTIONS = ["All", "Field Sales", "Collection"];

export default function MyVisitsPage() {
  const navigate = useNavigate();

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Load fake visits — replace with real API call when backend ready
  useEffect(() => {
    setTimeout(() => {
      setVisits(FAKE_VISITS);
      setLoading(false);
    }, 800);
  }, []);

  // Filter + search logic
  const filtered = visits.filter((v) => {
    const matchFilter = filter === "All" || v.shopType === filter;
    const matchSearch =
      v.shopName.toLowerCase().includes(search.toLowerCase()) ||
      v.shopCode.toLowerCase().includes(search.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full hover:bg-blue-500 transition"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-base font-semibold">My Visits</h1>
          <p className="text-xs text-blue-200">{visits.length} total visits</p>
        </div>
        {/* New Visit Button */}
        <button
          onClick={() => navigate("/visit-shop")}
          className="bg-white text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full"
        >
          + New
        </button>
      </div>

      <div className="px-4 pt-4 space-y-3">

        {/* SEARCH BAR */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by shop name, code, owner..."
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* FILTER CHIPS */}
        <div className="flex gap-2">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
                ${filter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading visits...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm text-gray-400">No visits found</p>
            <button
              onClick={() => navigate("/visit-shop")}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"
            >
              Start a Visit
            </button>
          </div>
        )}

        {/* VISIT CARDS */}
        {!loading && filtered.map((visit) => (
          <ShopVisitCard key={visit._id} visit={visit} />
        ))}

      </div>
    </div>
  );
}