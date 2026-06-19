// ============================================================
//  FILE: src/hooks/useCamera.js
//  OWNER: Naveen
//  PURPOSE: Custom hook that handles camera and photo upload.
//           Used in UploadPhotosPage.jsx
//           Returns { photos, error, addPhotos, removePhoto, clearPhotos }
// ============================================================

import { useState, useCallback } from "react";

const MAX_PHOTOS = 5;
const MAX_SIZE_MB = 5;

export function useCamera() {
  const [photos, setPhotos]   = useState([]);
  const [error, setError]     = useState(null);

  // Called when user picks images from file input
  // Accepts File objects from input[type=file]
  const addPhotos = useCallback((files) => {
    setError(null);
    const fileArray = Array.from(files);

    // Check max count
    if (photos.length + fileArray.length > MAX_PHOTOS) {
      setError(`Maximum ${MAX_PHOTOS} photos allowed.`);
      return;
    }

    // Check file size
    const oversized = fileArray.find(
      (f) => f.size > MAX_SIZE_MB * 1024 * 1024
    );
    if (oversized) {
      setError(`Each photo must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    // Check file type
    const invalid = fileArray.find(
      (f) => !f.type.startsWith("image/")
    );
    if (invalid) {
      setError("Only image files are allowed.");
      return;
    }

    // Create preview URLs and store
    const newPhotos = fileArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  }, [photos]);

  // Remove a single photo by index
  const removePhoto = useCallback((index) => {
    setPhotos((prev) => {
      const updated = [...prev];
      // Revoke object URL to free memory
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
    setError(null);
  }, []);

  // Clear all photos
  const clearPhotos = useCallback(() => {
    setPhotos((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.preview));
      return [];
    });
    setError(null);
  }, []);

   // Convert all photos to base64 for API submission
  // Returns a plain array of base64 strings (backend expects raw strings)
  const getBase64Photos = useCallback(() => {
    return Promise.all(
      photos.map(
        (p) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(p.file);
          })
      )
    );
  }, [photos]);

  return {
    photos,
    error,
    addPhotos,
    removePhoto,
    clearPhotos,
    getBase64Photos,
    hasPhotos: photos.length > 0,
    isFull: photos.length >= MAX_PHOTOS,
    count: photos.length,
  };
}