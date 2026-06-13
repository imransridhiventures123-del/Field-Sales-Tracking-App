// ============================================================
//  FILE: src/utils/helpers.js
//  OWNER: Both Naveen and Imran can add to this file
//  PURPOSE: Small reusable helper functions used across pages
// ============================================================

// ── DATE HELPERS ─────────────────────────────────────────────

// Returns "Today", "Yesterday", or "12 Jun"
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// Returns "04:37 pm"
export function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Returns "Today · 04:37 pm" or "12 Jun · 04:37 pm"
export function formatDateTime(dateStr) {
  return `${formatDate(dateStr)} · ${formatTime(dateStr)}`;
}

// Returns "12 Jun 2026, 04:37 pm"
export function formatFullDateTime(dateStr) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── MOBILE NUMBER HELPERS ─────────────────────────────────────

// "9876543210" → "+91 98765 43210"
export function formatMobile(mobile) {
  if (!mobile) return "—";
  const cleaned = mobile.replace(/\D/g, "").slice(-10);
  return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
}

// Returns true if valid Indian mobile number
export function isValidMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile);
}

// ── TEXT HELPERS ──────────────────────────────────────────────

// "Annas Provision Store" (25 chars) → "Annas Provision Sto..."
export function truncateText(text, maxLength = 20) {
  if (!text) return "—";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// "Annas Kumar" → "AK"
// "Annas" → "AN"
export function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Capitalizes first letter of each word
// "anna provision store" → "Anna Provision Store"
export function toTitleCase(str) {
  if (!str) return "";
  return str.replace(/\w\S*/g, (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

// ── GPS HELPERS ───────────────────────────────────────────────

// 13.082700 → "13.0827° N"
export function formatLatitude(lat) {
  if (lat == null) return "—";
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
}

// 80.270700 → "80.2707° E"
export function formatLongitude(lng) {
  if (lng == null) return "—";
  return `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
}

// ── MISC HELPERS ──────────────────────────────────────────────

// Delays execution — used for UX feedback
// await sleep(400) → waits 400ms
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Safely parse JSON without crashing
export function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}