import { appendFile } from 'fs/promises';
import { join } from 'path';

/**
 * Write log data into text file in log directory.
 * @param {Object} configParam Configuration parameters passed via the command line interface.
 * @param {string} data The log message to be written in the log file
 * @returns {Promise<void>} A promise that resolves when the writing operation is completed
 */
export async function writeLog(configParam, data) {
  const logFile = join(configParam.logDirectory, 'log.txt');
  return appendFile(logFile, data);
}
