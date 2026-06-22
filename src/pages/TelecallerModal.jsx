// FILE: src/components/TelecallerModal.jsx
// OWNER: Naveen
// PURPOSE: Bottom sheet modal to pick a telecaller and send PDF
// USED IN: EndOfDayPage.jsx

import { useState, useEffect } from "react";
import { STATUS_STYLE } from "../data/telecallerData";
import { getTelecallers } from "../api/visitApi";

export default function TelecallerModal({ onClose, onSend, generating }) {
  const [telecallers, setTelecallers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    const fetchTelecallers = async () => {
      try {
        const list = await getTelecallers();
        setTelecallers(list);
      } catch (err) {
        console.error("Telecallers fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTelecallers();
  }, []);

  const filtered = telecallers.filter((tc) =>
    tc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // ── BACKDROP ──
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-lg pb-safe">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Assign to Telecaller</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              PDF will be sent to the selected telecaller
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 active:scale-90 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search telecaller..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Telecaller list */}
        <div className="px-5 space-y-2 max-h-64 overflow-y-auto pb-2">
          {loading ? (
            <p className="text-center text-sm text-gray-400 py-6">Loading telecallers...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">No telecaller found</p>
          ) : (
            filtered.map((tc) => {
              const style   = STATUS_STYLE[tc.status];
              const isAvail = tc.status === "available";
              const isSel   = selected?._id === tc._id;

              return (
                <button
                  key={tc._id}
                  onClick={() => isAvail && setSelected(tc)}
                  disabled={!isAvail}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition
                    ${isSel
                      ? "border-blue-500 bg-blue-50"
                      : isAvail
                      ? "border-gray-100 bg-white active:scale-[0.98]"
                      : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                    }`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isSel ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"
                  }`}>
                    {tc.avatar}
                  </div>

                  {/* Name + phone */}
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-900">{tc.name}</p>
                    <p className="text-xs text-gray-400">{tc.phone}</p>
                  </div>

                  {/* Status badge */}
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text} flex items-center gap-1.5`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {style.label}
                  </span>

                  {/* Selected tick */}
                  {isSel && (
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Send button */}
        <div className="px-5 pt-3 pb-6 border-t border-gray-100">
          {selected && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2.5 mb-3">
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="text-xs text-blue-700">
                PDF will be assigned to <span className="font-semibold">{selected.name}</span>
              </p>
            </div>
          )}

          <button
            onClick={() => selected && onSend(selected)}
            disabled={!selected || generating}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all
              bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
              disabled:opacity-40 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Generate & Send PDF
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}