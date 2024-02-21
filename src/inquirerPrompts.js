import { existsSync, statSync } from 'fs';
import { homedir } from 'os';
import { join, basename } from 'path';

import { listMZML } from './listMZML.js';

// Inquirer interactive prompts
const prompts = [
  {
    type: 'input',
    name: 'inputDirectory',
    message: 'Specify input directory containing mzML data files:',
    validate: (inputDirectory) => {
      if (!inputDirectory) {
        return 'Input directory is required';
      } else if (!existsSync(inputDirectory)) {
        return 'Input directory does not exist';
      } else if (!statSync(inputDirectory).isDirectory()) {
        return 'Input directory specified is not a directory';
      }
      return true;
    },
  },
  {
    type: 'checkbox',
    name: 'fileList',
    message: 'Select file(s) to process:\n',
    choices: async (answers) => {
      return listMZML(answers.inputDirectory);
    },
    validate: (fileList) => {
      if (fileList.length === 0) {
        return 'At least one file needs to be selected';
      }
      return true;
    },
  },
  {
    type: 'input',
    name: 'outputDirectory',
    message: 'Specify output directory:',
    default: async (answers) => {
      return join(homedir(), '/data/JSON/', `${basename(answers.inputDirectory)}/`);
    },
  },
  {
    type: 'input',
    name: 'logDirectory',
    message: 'Specify log directory:',
    default: join(homedir(), '/.exfilms/'),
  },
  {
    type: 'input',
    name: 'decimalPlace',
    message: 'Number of decimal places to round precision values to?',
    default: NaN,
  },
  {
    type: 'confirm',
    name: 'targeted',
    message: 'Filter for targeted m/z values?',
    default: false,
  },
  {
    type: 'input',
    name: 'targetFile',
    message:
      'Specify target file (locally stored path or published to web URL - tsv file):',
    validate: async (targetFile) => {
      const urlPattern = /^(?:http|https):\/\/[^ "]+&output=tsv$/;
      const tsvPattern = /\.tsv$/i;

      if (!targetFile) {
        return 'Target file is required';
      }

      if (!urlPattern.test(targetFile) && !tsvPattern.test(targetFile)) {
        return 'Invalid target file input';
      }

      if (tsvPattern.test(targetFile)) {
        if (!existsSync(targetFile)) {
          return 'Target file does not exist at the specified path';
        }
        if (!statSync(targetFile).isFile()) {
          return 'Target file specified is not a file';
        }
      }
      return true;
    },
    when: (answers) => answers.targeted,
  },
  {
    type: 'input',
    name: 'mzTolerance',
    message: 'Set accepted m/z tolerance:',
    default: 0.005,
    validate: (mzTolerance) => {
      const tolerance = Number(mzTolerance);
      if (isNaN(tolerance)) {
        return 'Please enter a valid number';
      }
      return true;
    },
    when: (answers) => answers.targeted,
  },
  {
    type: 'input',
    name: 'ppmTolerance',
    message: 'Set accepted mass accuracy (ppm) tolerance:',
    default: 5,
    validate: (ppmTolerance) => {
      const tolerance = Number(ppmTolerance);
      if (isNaN(tolerance)) {
        return 'Please enter a valid number';
      }
      return true;
    },
    when: (answers) => answers.targeted,
  },
  {
    type: 'confirm',
    name: 'mzRange',
    message: 'Filter for specific m/z value range?',
    default: false,
    when: (answers) => !answers.targeted,
  },
  {
    type: 'input',
    name: 'minMZ',
    message: 'Set minimum m/z value:',
    default: 0,
    validate: (minMZ) => {
      const min = Number(minMZ);
      if (isNaN(min)) {
        return 'Please enter a valid number';
      }
      return true;
    },
    when: (answers) => answers.mzRange,
  },
  {
    type: 'input',
    name: 'maxMZ',
    message: 'Set maximum m/z value',
    default: NaN,
    validate: (maxMZ, answers) => {
      const max = Number(maxMZ);
      const min = Number(answers.minMZ);
      if (max <= min) {
        return `Please enter a valid number greater than ${min}`;
      }
      return true;
    },
    when: (answers) => answers.mzRange,
  },
  {
    type: 'confirm',
    name: 'filterSpectrumData',
    message:
      'Filter spectrum data based on spectrum type, MS levels and polarity, or exclude m/z data array?',
    default: false,
  },
  {
    type: 'checkbox',
    name: 'spectrumType',
    message: 'Select spectrum type to filter for?',
    choices: ['profile', 'centroid'],
    default: ['profile', 'centroid'],
    when: (answers) => answers.filterSpectrumData,
  },
  {
    type: 'input',
    name: 'msLevel',
    message: 'Specify MS level(s) to filter for (space-separated)?',
    default: '1 2',
    validate: (msLevel) => {
      const levels = msLevel.split(' ').map(Number);

      if (levels.some(isNaN)) {
        return 'Please enter a space-separated list of numbers';
      }

      if (levels.some((num) => num <= 0)) {
        return 'Please enter only numbers greater than 0';
      }

      if (new Set(levels).size !== levels.length) {
        return 'Please enter unique numbers';
      }
      return true;
    },
    when: (answers) => answers.filterSpectrumData,
  },
  {
    type: 'checkbox',
    name: 'polarity',
    message: 'Select polarity to filter for?',
    choices: ['positive', 'negative'],
    default: ['positive', 'negative'],
    when: (answers) => answers.filterSpectrumData,
  },
  {
    type: 'confirm',
    name: 'excludeMzData',
    message: 'Exclude m/z and intensity values from output?',
    default: false,
    when: (answers) => answers.filterSpectrumData,
  },
];

export { prompts };
