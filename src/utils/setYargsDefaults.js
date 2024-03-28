// @ts-nocheck

/**
 * @typedef {import('../typedef/index.mjs').Yargs} Yargs
 */

import { homedir } from 'os';
import { join, basename } from 'path';

import { listMZML } from './listMZML.js';

/**
 * Set the configuration parameters based on Yargs input.
 * @param {Yargs} argv Yargs command line arguments.
 * @returns {Promise<Object>} A promise that resolves with an object containing the configuration parameters in the required format for execution.
 * @throws {Error} Throws error if setYargsDefaults() encounters issues in its process.
 */
export async function setYargsDefaults(argv) {
  let configParam = {};

  // General config
  configParam.inputDirectory = argv.inputDirectory;
  configParam.fileList =
    argv.fileList[0] === '*'
      ? await listMZML(argv.inputDirectory)
      : argv.fileList;
  configParam.outputFormat = argv.outputFormat[0];
  configParam.outputDirectory =
    argv.outputDirectory ===
    join(homedir(), '/exfilms/outputFormat/inputDirectoryName/')
      ? join(
          homedir(),
          `/exfilms/${configParam.outputFormat}/${basename(
            configParam.inputDirectory,
          )}/`,
        )
      : argv.outputDirectory;
  configParam.logDirectory = argv.logDirectory;
  configParam.decimalPlace = argv.decimalPlace;

  // Targeted m/z filtering config
  configParam.targeted = argv.targeted;
  if (configParam.targeted) {
    configParam.targetFile = argv.targetFile;
    configParam.mzTolerance = argv.mzTolerance;
    configParam.ppmTolerance = argv.ppmTolerance;
  }

  // m/z range filtering config
  configParam.mzRange = argv.mzRange;
  if (configParam.mzRange) {
    configParam.minMZ = argv.minMZ;
    configParam.maxMZ = argv.maxMZ;
  }

  // Spectrum data filtering config
  configParam.filterSpectrumData = argv.filterSpectrumData;
  if (configParam.filterSpectrumData) {
    configParam.spectrumType = argv.spectrumType;
    configParam.msLevel = argv.msLevel;
    configParam.polarity = argv.polarity;
    configParam.excludeSpectra = argv.excludeSpectra;
  }

  return configParam;
}