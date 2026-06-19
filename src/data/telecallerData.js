// FILE: src/data/telecallerData.js
// OWNER: Imran
// PURPOSE: Dummy telecaller list — replace with API call when backend ready
// CREATE FOLDER: src/data/

export const TELECALLERS = [
  { _id: "tc001", name: "Priya R",     phone: "8925864472", status: "available",   avatar: "PR" }
  
];

// Status colors used in TelecallerModal
export const STATUS_STYLE = {
  available:   { dot: "bg-green-500",  label: "Available",   text: "text-green-700",  bg: "bg-green-50"  },
  busy:        { dot: "bg-amber-500",  label: "Busy",        text: "text-amber-700",  bg: "bg-amber-50"  },
  unavailable: { dot: "bg-red-400",    label: "Unavailable", text: "text-red-600",    bg: "bg-red-50"    },
};