import { appendFile } from 'fs/promises';
import { join } from 'path';

/**
 * Write log data into log.txt in log directory.
 * @param {string} logDirectory Log directory path.
 * @param {string} data The log data.
 * @returns {Promise<void>} A promise that resolves when the log data is successfully written into the log file.
 * @throws {Error} Throws error if writeLog() encounters issues in its process.
 */
export async function writeLog(logDirectory, data) {
  // Check input type
  if (typeof logDirectory !== 'string') {
    throw new Error('writeLog(): logDirectory must be of type string');
  } else if (typeof data !== 'string') {
    throw new Error('writeLog(): data must be of type string');
  }

  // Write data to log.txt
  const logFile = join(logDirectory, 'log.txt');
  return appendFile(logFile, data);
}
