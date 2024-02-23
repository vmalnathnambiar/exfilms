import { appendFile } from 'fs/promises';
import { join } from 'path';

import { configParam } from '../bin/exfilms.js';

// Write log data into file
export async function writeLog(data) {
  const logFile = join(configParam.logDirectory, 'log.txt');
  return appendFile(logFile, data);
}
