import { appendFile } from 'fs/promises';
import { join } from 'path';

/**
 * Write log data into log.txt in log directory.
 * @param {string} logDirectory Log directory path.
 * @param {string} data The log message to be written in the log file
 * @returns {Promise<void>} A promise that resolves when the writing operation is completed
 * @throws {Error} Throws error if writeLog() encounters issues in its process.
 */
export async function writeLog(logDirectory, data) {
  // Check input type
  if (typeof logDirectory !== 'string') {
    throw new Error('\nwriteLog(): logDirectory must be of type string');
  } else if (typeof data !== 'string') {
    throw new Error('\nwriteLog(): data must be of type string');
  }

  // Write data to log.txt
  const logFile = join(logDirectory, 'log.txt');
  return appendFile(logFile, data);
}
