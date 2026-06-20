// FILE: src/api/entryApi.js
// OWNER: Imran
// Backend support for PerformanceLedger.jsx

import axiosInstance from "./axiosInstance";

// Get this employee's ledger entries (collections + sales)
export const getMyEntries = async () => {
  const res = await axiosInstance.get("/api/entries/my");
  return res.data.entries || [];
};

// Add a new collection or sale entry
export const addEntry = async (entry) => {
  const res = await axiosInstance.post("/api/entries", entry);
  return res.data.entry;
};

// Delete an entry
export const deleteEntry = async (id) => {
  const res = await axiosInstance.delete(`/api/entries/${id}`);
  return res.data;
};