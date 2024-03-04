import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { parse } from 'arraybuffer-xml-parser';

import { spinner, configParam } from '../bin/exfilms.js';

import { extractMZML } from './extractMZML.js';
import { writeLog } from './writeLog.js';

/**
 * Parse mzML files to be processed for MS data extraction (and filtration).
 * @return {Promise<void>} A promise that resolves when all mzML files to be processed have been parsed and extracted (and filtered).
 * @throws {?Error} Throw error displaying a list of mzML files that encountered issues in the parsing process.
 */
export async function parseMZML() {
  let failedFiles = [];

  spinner.info(
    `Extracting MS data from ${configParam.fileList.length} file(s):`,
  );

  // Loop through file list
  for (const file of configParam.fileList) {
    spinner.text = `File ${configParam.fileList.indexOf(file) + 1} - ${file}`;
    spinner.start();

    try {
      // Check file path
      const filePath = join(configParam.inputDirectory, file);
      if (!existsSync(filePath)) {
        throw new Error(`File not found: ${file}`);
      }

      // Get current timestamp
      let currDateTime = new Date();
      let logger = `${currDateTime}\t${file}\n`;

      // Parse mzML data file
      let msData = parse(readFileSync(filePath));

      // Extract MS data
      await extractMZML(msData);

      // Write timestamp and file name into log file
      await writeLog(logger);
      spinner.succeed();
    } catch (err) {
      failedFiles.push(file);
      spinner.fail();
    }
  }

  // Write failed files list into log file
  await writeLog(`Failed files: [${failedFiles}]\n\n`);

  // Throw error if there were failed files
  if (failedFiles.length !== 0) {
    throw new Error(`\nExtraction failure:\n${failedFiles}`);
  }
}
