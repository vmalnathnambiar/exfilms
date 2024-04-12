/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { parse } from 'arraybuffer-xml-parser';
import ora from 'ora';

import { extractMS } from './extractMS.js';
import { writeLog } from './writeLog.js';

/**
 * Parse mzML files to be processed for MS data extraction (and filtration).
 * @param {Object} configParam Configuration parameters.
 * @return {Promise<void>} A promise that resolves when all mzML data file have been processed.
 * @throws {Error} Throws error if processMZML() encounters issues in its process.
 */
export async function processMZML(configParam) {
  const spinner = ora();
  const failedFiles = [];
  let logData;

  // Display number of mzML files to process
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
        throw new Error('processMZML(): File not found in input directory');
      }

      // Get current timestamp of file processing for log
      const currDateTime = new Date();
      logData = `${currDateTime}\t${file}`;

      // Parse and extract MS data from mzML data file
      const mzmlData = parse(readFileSync(filePath));
      await extractMS(configParam, mzmlData);
      spinner.succeed();
    } catch (err) {
      failedFiles.push(file);
      spinner.fail();
      console.error(err.toString());
      logData = `${logData}\t${err.toString()}`;
    } finally {
      try {
        // Write timestamp and file name (and error message) into log file
        await writeLog(configParam.logDirectory, `${logData}\n`);
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
