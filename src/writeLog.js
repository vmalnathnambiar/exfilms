import { appendFile } from 'fs/promises';
import { join } from 'path';

import { configParam } from '../bin/exfilms.js';

/**
 * Write log data into text file in log directory.
 * @param {string} data The log message to be written in the log file
 * @returns {Promise<void>} A promise that resolves when the writing operation is completed
 */
export async function writeLog(data) {
  const logFile = join(configParam.logDirectory, 'log.txt');
  return appendFile(logFile, data);
}
