/**
 * Default fallback avatar data URI and error handler for consistent profile image rendering.
 * Prevents recursive error loops and displays a clean 4:5 neutral silhouette.
 */
export const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500" fill="%23f1f5f9"><rect width="400" height="500" fill="%23f1f5f9"/><circle cx="200" cy="180" r="65" fill="%23cbd5e1"/><path d="M100 390 C100 290 300 290 300 390 Z" fill="%23cbd5e1"/></svg>';

export const handleImageError = (e) => {
  if (e && e.target) {
    e.target.onerror = null;
    e.target.src = DEFAULT_AVATAR;
  }
};
