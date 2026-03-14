/**
 * Utility helpers for OmniRecon
 */

/**
 * Format a geographic coordinate value for display.
 * @param {number} value - Decimal degrees
 * @param {'lat'|'lon'} type - Coordinate type
 * @returns {string} Formatted coordinate string
 */
export function formatCoordinate(value, type) {
  const abs = Math.abs(value);
  const dir =
    type === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
  return `${abs.toFixed(4)}° ${dir}`;
}

/**
 * Clamp a numeric value within [min, max].
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
