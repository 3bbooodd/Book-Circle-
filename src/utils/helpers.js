/**
 * Utility helper functions
 */

/**
 * Format a date to locale string
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
  if (!date) return 'Just now';
  const d = new Date(date);
  return d.toLocaleString();
}

/**
 * Generate a unique ID
 * @returns {string} - Unique ID
 */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Check if a value is defined and not empty
 * @param {any} value - The value to check
 * @returns {boolean} - True if value is defined and not empty
 */
export function isNotEmpty(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - The JSON string to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} - Parsed JSON or default value
 */
export function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
}
