/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { parse } from 'arraybuffer-xml-parser';
import ora from 'ora';

import { extractMZML } from './extractMZML.js';
import { writeLog } from './writeLog.js';

/**
 * Parse mzML files to be processed for MS data extraction (and filtration).
 * @param {Object} configParam Configuration parameters passed via the command line interface.
 * @return {Promise<void>} A promise that resolves when all mzML files to be processed have been parsed and extracted (and filtered).
 * @throws {Error} Throws error if parseMZML() encounters issues in its process.
 */
export async function parseMZML(configParam) {
  const spinner = ora();
  let failedFiles = [];
  let currDateTime;
  let logger;

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
        throw new Error('parseMZML(): File not found in input directory');
      }

      // Get current timestamp
      currDateTime = new Date();
      logger = `${currDateTime}\t${file}`;

      // Parse mzML data file
      let msData = parse(readFileSync(filePath));

      // Extract MS data
      await extractMZML(configParam, msData);

      spinner.succeed();
    } catch (err) {
      failedFiles.push(file);
      spinner.fail();
      console.error(err.toString());
      logger = `${logger}\t${err.toString()}`;
    } finally {
      try {
        // Write timestamp and file name (and error message) into log file
        await writeLog(configParam.logDirectory, `${logger}\n`);
      } catch (err) {
        console.error(err.toString());
      }
    }
  }

  // Write failed files list into log file
  try {
    await writeLog(
      configParam.logDirectory,
      `Failed files: [${failedFiles}]\n\n`,
    );
  } catch (err) {
    console.error(`\n${err.toString()}`);
  }

  // Throw error if there were failed files
  if (failedFiles.length !== 0) {
    throw new Error(`\nExtraction failure: ${failedFiles}`);
  }
}
