/**
 * @typedef {import('../typedef/index.mjs').Timestamp} Timestamp
 */

/**
 * Extract date and time from timestamp.
 * @param {string} timestamp Timestamp to extract date and time from (Format: 'YYYY-MM-DD HH:mm:ss').
 * @returns {Promise<Timestamp>} A promise that resolves with a Timestamp object containing the extracted date and time.
 * @throws {Error} Throws error if extractTimestamp() encounters issues in its process.
 */
export async function extractTimestamp(timestamp) {
  // Check input type
  if (typeof timestamp !== 'string') {
    throw new Error('extractTimestamp(): timestamp must be of type string');
  }

  // Extract date and time based on pattern
  const dateMatch = timestamp.match(/\d{4}-\d{2}-\d{2}/);
  const timeMatch = timestamp.match(/\d{2}:\d{2}:\d{2}/);

  const date = dateMatch ? dateMatch[0] : null;
  const time = timeMatch ? timeMatch[0] : null;

  return { date, time };
}
