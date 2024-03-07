import { appendFile } from 'fs/promises';
import { join } from 'path';

/**
 * Write log data into text file in log directory.
 * @param {Object} configParam Configuration parameters passed via the command line interface.
 * @param {string} data The log message to be written in the log file
 * @returns {Promise<void>} A promise that resolves when the writing operation is completed
 * @throws {?Error} Throws error if writing to log process encounters issues.
 */
export async function writeLog(configParam, data) {
  // Check input parameters
  if (typeof configParam.logDirectory !== 'string') {
    throw new Error('\nlog directory path must be a string');
  } else if (typeof data !== 'string') {
    throw new Error('\ndata must be a string');
  }

  // Write to file
  const logFile = join(configParam.logDirectory, 'log.txt');
  return appendFile(logFile, data);
}
