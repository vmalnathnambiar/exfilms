/**
 * Extract date and time from time stamp.
 * @param {string} timeStamp Timestamp to extract date and time from (Format: 'YYYY-MM-DD HH:mm:ss').
 * @returns {Promise<Object>} A promise that resolves with an object containing the extracted date and time.
 */
export async function extractTimeStamp(timeStamp) {
  const dateMatch = timeStamp.match(/\d{4}-\d{2}-\d{2}/);
  const timeMatch = timeStamp.match(/\d{2}:\d{2}:\d{2}/);

  const date = dateMatch ? dateMatch[0] : null;
  const time = timeMatch ? timeMatch[0] : null;

  return { date, time };
}
