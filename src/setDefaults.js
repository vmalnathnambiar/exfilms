import { homedir } from 'os';
import { join, basename } from 'path';

import { listMZML } from './listMZML.js';

// Set default values for parameter configuration
export async function setDefaults(argv) {
  let configParam = {};

  // General input config
  configParam.inputDir = argv.inputDir;
  configParam.fileList =
    argv.fileList[0] === '*' ? await listMZML(argv.inputDir) : argv.fileList;
  configParam.outputDir =
    argv.outputDir === join(homedir(), '/data/JSON/')
      ? join(argv.outputDir, `${basename(argv.inputDir)}/`)
      : argv.outputDir;
  configParam.logDir = argv.logDir;
  configParam.decimalPlace = argv.decimalPlace;

  // Targeted assay config
  configParam.targetedAssay = argv.targetedAssay;
  if (configParam.targetedAssay) {
    configParam.targetFile = argv.targetFile;
    configParam.mzTolerance = argv.mzTolerance;
    configParam.ppm = argv.ppm;
  }

  // m/z range config
  configParam.mzRange = argv.mzRange;
  if (configParam.mzRange) {
    configParam.minMZ = argv.minMZ;
    configParam.maxMZ = argv.maxMZ;
  }

  // Filter spectrum config
  configParam.filterSpectrum = argv.filterSpectrum;
  if (configParam.filterSpectrum) {
    configParam.spectrumType = argv.spectrumType;
    configParam.msLevel = argv.msLevel;
    configParam.polarity = argv.polarity;
    configParam.excludeMzData = argv.excludeMzData;
  }

  return configParam;
}
