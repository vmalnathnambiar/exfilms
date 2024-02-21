import { appendFile } from 'fs/promises';
import { join } from 'path';

import { pkg, configParam } from '../bin/exfilms.js';

// Write log data into file
export async function writeLog(data) {
  const logFile = join(configParam.logDirectory, `${pkg.name}_log.txt`);
  return appendFile(logFile, data);
}
