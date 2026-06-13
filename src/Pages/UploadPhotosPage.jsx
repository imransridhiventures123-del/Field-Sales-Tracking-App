import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVisit } from "../context/VisitContext";

export default function UploadPhotosPage() {
  const navigate = useNavigate();
  const { visitForm, updateVisitForm, submitVisit, isSubmitting } = useVisit();

  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      setError("Maximum 5 photos allowed.");
      return;
    }
    setError(null);

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (photos.length === 0) {
      setError("Please add at least one photo.");
      return;
    }
    setError(null);
    setSubmitError(null);

    updateVisitForm({ notes });

    // Convert photos to base64 for API
    const base64Photos = await Promise.all(
      photos.map(
        (p) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ name: p.name, base64: reader.result });
            reader.readAsDataURL(p.file);
          })
      )
    );

    const result = await submitVisit({ photos: base64Photos, notes });

    if (result.success) {
      navigate("/visit-summary");
    } else {
      setSubmitError(result.error || "Submission failed. Please try again.");
    }
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
        <div>
          <h1 className="text-base font-semibold">Upload Photos</h1>
          <p className="text-xs text-blue-200">Step 3 of 3 — Photos & Submit</p>
        </div>
      </div>

      {/* STEP PROGRESS */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 border-b border-gray-100">
        <div className="w-8 h-1.5 rounded-full bg-blue-600" />
        <div className="w-8 h-1.5 rounded-full bg-blue-600" />
        <div className="w-8 h-1.5 rounded-full bg-blue-600" />
        <span className="ml-2 text-xs text-gray-400">Shop Info → Location → Photos</span>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* VISIT SUMMARY CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Visit Summary
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shop</span>
            <span className="font-medium text-gray-800">{visitForm.shopName || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Code</span>
            <span className="font-medium text-gray-800">{visitForm.shopCode || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Owner</span>
            <span className="font-medium text-gray-800">{visitForm.ownerName || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">GPS</span>
            <span className="font-medium text-gray-800">
              {visitForm.latitude
                ? `${visitForm.latitude.toFixed(4)}, ${visitForm.longitude.toFixed(4)}`
                : "—"}
            </span>
          </div>
        </div>

        {/* PHOTO UPLOAD */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Shop Photos
        </p>

        {/* PHOTO GRID */}
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
              <img
                src={photo.preview}
                alt={`photo-${index}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          {/* ADD PHOTO BUTTON */}
          {photos.length < 5 && (
            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-gray-50 transition">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">Add Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </label>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center">
          {photos.length}/5 photos added
        </p>

        {error && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}

        {/* NOTES */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any observations about this shop visit..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
          />
        </div>

        {/* SUBMIT ERROR */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-xs text-red-600">{submitError}</p>
          </div>
        )}

      </div>

      {/* SUBMIT BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || photos.length === 0}
          className={`w-full py-4 rounded-xl text-white font-semibold text-base transition
            ${isSubmitting || photos.length === 0
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
        >
          {isSubmitting ? "Submitting Visit..." : "Submit Visit ✓"}
        </button>
      </div>

    </div>
  );
}