import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Fake visits — same as MyVisitsPage, remove when backend ready
const FAKE_VISITS = [
  {
    _id: "1",
    shopName: "Annas Provision Store",
    shopCode: "AP001",
    ownerName: "Annas",
    mobile: "9876543210",
    shopType: "Field Sales",
    address: "123, Main Street, Chennai, Tamil Nadu 600001",
    categories: ["Grocery", "Provisions"],
    latitude: 13.0827,
    longitude: 80.2707,
    locationAccuracy: 12,
    photos: [],
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
    address: "45, Anna Nagar, Chennai, Tamil Nadu 600040",
    categories: ["Beverages", "Medical"],
    latitude: 13.0569,
    longitude: 80.2425,
    locationAccuracy: 8,
    photos: [],
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
    address: "78, T Nagar, Chennai, Tamil Nadu 600017",
    categories: ["Grocery"],
    latitude: 13.0674,
    longitude: 80.2376,
    locationAccuracy: 15,
    photos: [],
    notes: "Follow up next week",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function VisitDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // gets the :id from /visit-detail/:id

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapUrl = visit
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${visit.longitude - 0.005},${visit.latitude - 0.005},${visit.longitude + 0.005},${visit.latitude + 0.005}&layer=mapnik&marker=${visit.latitude},${visit.longitude}`
    : null;

  // Load fake visit by id — replace with real API when backend ready
  useEffect(() => {
    setTimeout(() => {
      const found = FAKE_VISITS.find((v) => v._id === id);
      setVisit(found || null);
      setLoading(false);
    }, 600);
  }, [id]);

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading visit...</p>
        </div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm text-gray-500">Visit not found</p>
        <button
          onClick={() => navigate("/my-visits")}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl"
        >
          Back to My Visits
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

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
          <h1 className="text-base font-semibold">{visit.shopName}</h1>
          <p className="text-xs text-blue-200">{formatDateTime(visit.createdAt)}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full
          ${visit.shopType === "Field Sales"
            ? "bg-blue-500 text-white"
            : "bg-purple-500 text-white"
          }`}>
          {visit.shopType}
        </span>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* SHOP INFO CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Shop Information
          </p>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shop Name</span>
            <span className="font-medium text-gray-800">{visit.shopName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shop Code</span>
            <span className="font-medium text-gray-800">{visit.shopCode}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Owner</span>
            <span className="font-medium text-gray-800">{visit.ownerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mobile</span>
            <a
              href={`tel:+91${visit.mobile}`}
              className="font-medium text-blue-600"
            >
              +91 {visit.mobile}
            </a>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Address</span>
            <span className="font-medium text-gray-800 text-right max-w-[60%]">{visit.address}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Categories</span>
            <div className="flex gap-1 flex-wrap justify-end max-w-[60%]">
              {visit.categories.map((cat) => (
                <span key={cat} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* GPS MAP CARD */}
        {visit.latitude && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                GPS Location
              </p>
            </div>
            <iframe
              title="Visit location"
              src={mapUrl}
              width="100%"
              height="200"
              style={{ border: 0 }}
              loading="lazy"
            />
            <div className="px-4 py-3 flex justify-between text-xs text-gray-500">
              <span>{visit.latitude.toFixed(6)}, {visit.longitude.toFixed(6)}</span>
              <span className="text-green-500">±{visit.locationAccuracy}m accuracy</span>
            </div>
          </div>
        )}

        {/* PHOTOS CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Photos
          </p>
          {visit.photos?.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {visit.photos.map((photo, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={typeof photo === "string" ? photo : photo.uri}
                    alt={`visit-photo-${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No photos uploaded</p>
          )}
        </div>

        {/* NOTES CARD */}
        {visit.notes ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Notes
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{visit.notes}</p>
          </div>
        ) : null}

        {/* CALL BUTTON */}
        <a
          href={`tel:+91${visit.mobile}`}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-green-500 text-white font-semibold text-base"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call {visit.ownerName}
        </a>

      </div>
    </div>
  );
}