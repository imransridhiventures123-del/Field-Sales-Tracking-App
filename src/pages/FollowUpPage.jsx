// ============================================================
// FILE: src/pages/FollowUpPage.jsx
// OWNER: Naveen / Imran
// PURPOSE: Dedicated follow-up management page
// CHANGE: Removed DUMMY_FOLLOWUPS — now loads real visits with
// an open follow-up from the backend, and reschedule/mark-done
// actions persist via PUT /api/visits/:id/followup
// ============================================================

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMyFollowUps, rescheduleFollowUp, markFollowUpDone } from "../api/visitApi";

const TODAY = new Date().toISOString().split("T")[0];

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function daysDiff(dateStr) {
  const diff = Math.floor((new Date(dateStr) - new Date(TODAY)) / 86400000);
  return diff;
}

// Backend stores followUp.status as one of these enum keys —
// map them to the friendly labels the UI already uses.
const STATUS_LABELS = {
  interested:      "Interested",
  callback:        "Call Back",
  not_interested:  "Not Interested",
  busy:            "Busy / Come Later",
  order_placed:    "Order Placed",
  payment_due:     "Payment Due",
};

const STATUS_COLORS = {
  "Interested":        { bg: "bg-green-100",  text: "text-green-700" },
  "Call Back":         { bg: "bg-blue-100",   text: "text-blue-700" },
  "Payment Due":       { bg: "bg-red-100",    text: "text-red-700" },
  "Busy / Come Later": { bg: "bg-amber-100",  text: "text-amber-700" },
  "Order Placed":      { bg: "bg-violet-100", text: "text-violet-700" },
  "Not Interested":    { bg: "bg-gray-100",   text: "text-gray-600" },
};

const OUTCOME_OPTIONS = [
  { key: "order_placed",     label: "Order Placed" },
  { key: "payment_received", label: "Payment Received" },
  { key: "call_back_again",  label: "Call Back Again" },
  { key: "not_interested",   label: "Not Interested" },
  { key: "meeting_done",     label: "Meeting Done" },
];

// Map a raw backend visit into the shape this page's UI expects
function mapVisit(v) {
  return {
    _id: v._id,
    shopName: v.shopName,
    shopCode: v.shopCode,
    ownerName: v.ownerName,
    ownerMobile: v.mobile,
    fieldType: v.fieldType,
    followUpStatus: STATUS_LABELS[v.followUp?.status] || "Follow-up",
    followUpDate: v.followUp?.date || TODAY,
    lastNote: v.notes || "",
    visitDate: v.createdAt,
    outcome: null,
  };
}

export default function FollowUpPage() {
  const navigate = useNavigate();
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | overdue | today | upcoming
  const [expandedId, setExpandedId] = useState(null);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [doneModal, setDoneModal] = useState(null); // { id, selectedOutcome, note }
  const [toast, setToast] = useState("");

  // ── LOAD REAL FOLLOW-UPS FROM BACKEND ──────────────────────
  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const visits = await getMyFollowUps();
        setFollowups(visits.map(mapVisit));
      } catch (err) {
        console.error("Follow-ups fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowUps();
  }, []);

  // ── COMPUTED ──────────────────────────────────────────────
  const active = followups.filter((f) => !f.outcome);

  const overdue   = active.filter((f) => daysDiff(f.followUpDate) < 0);
  const todayList = active.filter((f) => f.followUpDate === TODAY);
  const upcoming  = active.filter((f) => daysDiff(f.followUpDate) > 0);

  const filtered = useMemo(() => {
    let list = filter === "overdue" ? overdue : filter === "today" ? todayList : filter === "upcoming" ? upcoming : active;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) => f.shopName.toLowerCase().includes(q) || f.ownerName.toLowerCase().includes(q));
    }
    return list;
  }, [followups, filter, search]);

  // ── ACTIONS ───────────────────────────────────────────────
  async function handleReschedule(id) {
    if (!rescheduleDate) return;
    try {
      await rescheduleFollowUp(id, rescheduleDate);
      setFollowups((prev) => prev.map((f) => f._id === id ? { ...f, followUpDate: rescheduleDate } : f));
      setRescheduleId(null);
      setRescheduleDate("");
      showToast("Follow-up rescheduled.");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not reschedule.");
    }
  }

  async function handleMarkDone(id, outcomeKey, note) {
    const outcomeLabel = OUTCOME_OPTIONS.find((o) => o.key === outcomeKey)?.label || "Done";
    try {
      await markFollowUpDone(id, outcomeLabel, note);
      setFollowups((prev) => prev.map((f) => f._id === id ? { ...f, outcome: outcomeKey || "done", outcomeNote: note, outcomeDate: TODAY } : f));
      setDoneModal(null);
      showToast("Marked as done.");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not update follow-up.");
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  function getDayLabel(dateStr) {
    const diff = daysDiff(dateStr);
    if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, color: "text-red-600 bg-red-50" };
    if (diff === 0) return { label: "Today", color: "text-amber-600 bg-amber-50" };
    if (diff === 1) return { label: "Tomorrow", color: "text-blue-600 bg-blue-50" };
    return { label: `In ${diff} days`, color: "text-blue-600 bg-blue-50" };
  }

  // ── SECTION RENDER ────────────────────────────────────────
  function renderSection(title, list, accentClass) {
    if (list.length === 0) return null;
    return (
      <div className="space-y-2">
        <div className={`flex items-center gap-2 px-1`}>
          <div className={`w-2 h-2 rounded-full ${accentClass}`} />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <span className="text-xs text-gray-400">({list.length})</span>
        </div>
        {list.map((f) => renderCard(f))}
      </div>
    );
  }

  function renderCard(f) {
    const isExpanded = expandedId === f._id;
    const isRescheduling = rescheduleId === f._id;
    const dayLabel = getDayLabel(f.followUpDate);
    const statusStyle = STATUS_COLORS[f.followUpStatus] || { bg: "bg-gray-100", text: "text-gray-600" };

    return (
      <div key={f._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

        {/* Card Header */}
        <div className="p-4" onClick={() => setExpandedId(isExpanded ? null : f._id)}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{f.shopName}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                  {f.followUpStatus}
                </span>
              </div>
              <p className="text-xs text-gray-400">{f.ownerName} · {f.shopCode}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${dayLabel.color}`}>
                {dayLabel.label}
              </span>
              <p className="text-[10px] text-gray-400">{formatDate(f.followUpDate)}</p>
            </div>
          </div>

          {/* Last note preview */}
          {f.lastNote && (
            <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2 bg-gray-50 rounded-lg px-3 py-2">
              {f.lastNote}
            </p>
          )}

          {/* Quick action row */}
          <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>

            {/* Call button */}
            <a href={`tel:${f.ownerMobile}`}
              className="flex items-center gap-1.5 bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-xl active:scale-95 transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Call
            </a>

            {/* Reschedule button */}
            <button
              onClick={() => { setRescheduleId(isRescheduling ? null : f._id); setRescheduleDate(""); }}
              className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-2 rounded-xl active:scale-95 transition border border-blue-100">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Reschedule
            </button>

            {/* Mark Done button */}
            <button
              onClick={() => setDoneModal({ id: f._id, selectedOutcome: "", note: "" })}
              className="flex items-center gap-1.5 bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-xl active:scale-95 transition ml-auto">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              Done
            </button>
          </div>
        </div>

        {/* Reschedule panel */}
        {isRescheduling && (
          <div className="border-t border-gray-100 px-4 py-3 bg-blue-50 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-700 mb-1.5">Pick new follow-up date</p>
              <input
                type="date"
                min={addDays(TODAY, 1)}
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => handleReschedule(f._id)}
              disabled={!rescheduleDate}
              className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl disabled:opacity-40 mt-5"
            >
              Confirm
            </button>
          </div>
        )}

        {/* Expanded detail */}
        {isExpanded && !isRescheduling && (
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Mobile</span>
              <a href={`tel:${f.ownerMobile}`} className="text-blue-600 font-medium">{f.ownerMobile}</a>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Field Type</span>
              <span className="text-gray-700 font-medium">{f.fieldType}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Last Visited</span>
              <span className="text-gray-700 font-medium">{formatDate(f.visitDate)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Follow-up Due</span>
              <span className="text-gray-700 font-medium">{formatDate(f.followUpDate)}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── RENDER ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24 font-sans">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate("/dashboard")}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="flex-1">
            <p className="text-xs text-gray-400 leading-none">Follow-ups</p>
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {loading ? "Loading..." : `${active.length} pending · ${overdue.length} overdue`}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shop or owner..."
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-2 overflow-x-auto pb-0.5">
          {[
            { key: "all",      label: "All",      count: active.length },
            { key: "overdue",  label: "Overdue",  count: overdue.length },
            { key: "today",    label: "Today",    count: todayList.length },
            { key: "upcoming", label: "Upcoming", count: upcoming.length },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                filter === f.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
              }`}>
              {f.label}
              {f.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  filter === f.key ? "bg-white/30 text-white" : 
                  f.key === "overdue" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-500"
                }`}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 pt-4 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-400">No follow-ups found</p>
          </div>
        ) : search.trim() ? (
          <div className="space-y-2">{filtered.map((f) => renderCard(f))}</div>
        ) : (
          <>
            {renderSection("Overdue", overdue.filter(f => !search || filtered.includes(f)), "bg-red-500")}
            {renderSection("Due Today", todayList.filter(f => !search || filtered.includes(f)), "bg-amber-500")}
            {renderSection("Upcoming", upcoming.filter(f => !search || filtered.includes(f)), "bg-blue-500")}
          </>
        )}
      </div>

      {/* MARK DONE MODAL */}
      {doneModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center px-4 pb-6">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl">
            <p className="text-base font-bold text-gray-900 mb-1">Mark as Done</p>
            <p className="text-xs text-gray-400 mb-4">What was the outcome of this follow-up?</p>

            <div className="space-y-2 mb-4">
              {OUTCOME_OPTIONS.map((opt) => (
                <button key={opt.key}
                  onClick={() => setDoneModal((d) => ({ ...d, selectedOutcome: opt.key }))}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition ${
                    doneModal.selectedOutcome === opt.key
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-100 text-gray-700"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Quick note (optional)</label>
              <textarea
                value={doneModal.note}
                onChange={(e) => setDoneModal((d) => ({ ...d, note: e.target.value }))}
                placeholder="What happened? Any important details..."
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setDoneModal(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-2xl text-sm">
                Cancel
              </button>
              <button
                onClick={() => handleMarkDone(doneModal.id, doneModal.selectedOutcome || "done", doneModal.note)}
                className="flex-1 py-3 bg-gray-900 text-white font-semibold rounded-2xl text-sm active:scale-95 transition">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50 pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  );
}