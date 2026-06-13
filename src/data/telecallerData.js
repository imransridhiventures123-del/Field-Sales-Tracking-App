// FILE: src/data/telecallerData.js
// OWNER: Imran
// PURPOSE: Dummy telecaller list — replace with API call when backend ready
// CREATE FOLDER: src/data/

export const TELECALLERS = [
  { _id: "tc001", name: "Priya R",     phone: "8925864472", status: "available",   avatar: "PR" },
  { _id: "tc002", name: "Divya S",     phone: "9876541002", status: "available",   avatar: "DS" },
  { _id: "tc003", name: "Meena K",     phone: "9876541003", status: "busy",        avatar: "MK" },
  { _id: "tc004", name: "Lakshmi P",   phone: "9876541004", status: "available",   avatar: "LP" },
  { _id: "tc005", name: "Kavitha M",   phone: "9876541005", status: "unavailable", avatar: "KM" },
  { _id: "tc006", name: "Anitha B",    phone: "9876541006", status: "available",   avatar: "AB" },
];

// Status colors used in TelecallerModal
export const STATUS_STYLE = {
  available:   { dot: "bg-green-500",  label: "Available",   text: "text-green-700",  bg: "bg-green-50"  },
  busy:        { dot: "bg-amber-500",  label: "Busy",        text: "text-amber-700",  bg: "bg-amber-50"  },
  unavailable: { dot: "bg-red-400",    label: "Unavailable", text: "text-red-600",    bg: "bg-red-50"    },
};