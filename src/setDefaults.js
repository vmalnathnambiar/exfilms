import { homedir } from 'os';
import { join, basename } from 'path';

import { listMZML } from './listMZML.js';

// Set default values for parameter configuration
export async function setDefaults(argv) {
  let configParam = {};

  // General input config
  configParam.inputDirectory = argv.inputDirectory;
  configParam.fileList =
    argv.fileList[0] === '*' ? await listMZML(argv.inputDirectory) : argv.fileList;
  configParam.outputDirectory =
    argv.outputDirectory === join(homedir(), '/data/JSON/')
      ? join(argv.outputDirectory, `${basename(argv.inputDir)}/`)
      : argv.outputDirectory;
  configParam.logDirectory = argv.logDirectory;
  configParam.decimalPlace = argv.decimalPlace;

  // Targeted config
  configParam.targeted = argv.targeted;
  if (configParam.targeted) {
    configParam.targetFile = argv.targetFile;
    configParam.mzTolerance = argv.mzTolerance;
    configParam.ppmTolerance = argv.ppmTolerance;
  }

  // m/z range config
  configParam.mzRange = argv.mzRange;
  if (configParam.mzRange) {
    configParam.minMZ = argv.minMZ;
    configParam.maxMZ = argv.maxMZ;
  }

  // Filter spectrum config
  configParam.filterSpectrumData = argv.filterSpectrumData;
  if (configParam.filterSpectrumData) {
    configParam.spectrumType = argv.spectrumType;
    configParam.msLevel = argv.msLevel;
    configParam.polarity = argv.polarity;
    configParam.excludeMzData = argv.excludeMzData;
  }

  return configParam;
}
