// FILE: src/context/VisitContext.jsx
// OWNER: Naveen
// UPDATED: Added submitVisit() — actually calls the backend now

import { createContext, useContext, useState } from "react";
import { submitVisit as submitVisitApi } from "../api/visitApi";

const VisitContext = createContext();

export function VisitProvider({ children }) {
  const [visitForm, setVisitForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateVisitForm = (data) =>
    setVisitForm((prev) => ({ ...prev, ...data }));

  const resetVisitForm = () => setVisitForm({});

  // Called by UploadPhotosPage.jsx — merges everything collected
  // across all 3 steps (shop info + GPS + photos) and sends it
  // to the backend in one request.
  const submitVisit = async (finalData) => {
    setIsSubmitting(true);
    try {
      const payload = { ...visitForm, ...finalData };
      const result = await submitVisitApi(payload);
      if (result.success) {
        resetVisitForm();
      }
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VisitContext.Provider value={{ visitForm, updateVisitForm, resetVisitForm, submitVisit, isSubmitting }}>
      {children}
    </VisitContext.Provider>
  );
}

export function useVisit() {
  const context = useContext(VisitContext);
  if (!context) {
    throw new Error("useVisit must be used inside VisitProvider");
  }
  return context;
}