import { createContext, useContext, useState, useCallback } from 'react';

const initialVisitForm = {
  shopName: '',
  shopCode: '',
  ownerName: '',
  mobileNumber: '',
  shopType: '',
  address: '',
  categories: [],
  latitude: null,
  longitude: null,
  photos: [],
  notes: '',
};

const VisitContext = createContext(null);

export function VisitProvider({ children }) {
  const [visitForm, setVisitForm] = useState(initialVisitForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateVisitForm = useCallback((fields) => {
    setVisitForm((prev) => ({ ...prev, ...fields }));
  }, []);

  const resetVisitForm = useCallback(() => {
    setVisitForm(initialVisitForm);
  }, []);

  // Temporary submitVisit — logs to console until backend is ready
  const submitVisit = useCallback(async (finalFields = {}) => {
    setIsSubmitting(true);
    const payload = { ...visitForm, ...finalFields };
    console.log('Visit payload ready to send to API:', payload);

    // Fake delay — remove when backend is ready
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    return { success: true, visit: payload };
  }, [visitForm]);

  return (
    <VisitContext.Provider value={{
      visitForm,
      updateVisitForm,
      resetVisitForm,
      submitVisit,
      isSubmitting,
    }}>
      {children}
    </VisitContext.Provider>
  );
}

export function useVisit() {
  const ctx = useContext(VisitContext);
  if (!ctx) throw new Error('useVisit must be used inside <VisitProvider>');
  return ctx;
}