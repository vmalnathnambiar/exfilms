// @ts-nocheck

import { existsSync, statSync } from 'fs';
import { homedir } from 'os';
import { join, basename } from 'path';

import { listMZML } from './listMZML.js';

/**
 * @type {Object}
 * @description An object containing user input for each interactive question prompt.
 */
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
        return 'At least ONE file needs to be selected';
      }
      return true;
    },
  },
  {
    type: 'checkbox',
    name: 'outputFormat',
    message: 'Select output format:',
    choices: ['JSON', 'TSV'],
    default: ['JSON'],
    validate: async (output) => {
      if (output.length === 0) {
        return 'Output format is required';
      } else if (output.length > 1) {
        return 'Please select only ONE output format';
      }
      return true;
    },
  },
  {
    type: 'input',
    name: 'outputDirectory',
    message: 'Specify output directory:',
    default: async (answers) => {
      return join(
        homedir(),
        `/exfilms/${answers.outputFormat}/${basename(answers.inputDirectory)}/`,
      );
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
    message: 'Filter mass spectra for targeted m/z values?',
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
      } else if (!urlPattern.test(targetFile) && !tsvPattern.test(targetFile)) {
        return 'Invalid target file input';
      } else if (tsvPattern.test(targetFile)) {
        if (!existsSync(targetFile)) {
          return 'Target file does not exist';
        } else if (!statSync(targetFile).isFile()) {
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
    message: 'Filter mass spectra for specific m/z range?',
    default: false,
    when: (answers) => !answers.targeted,
  },
  {
    type: 'input',
    name: 'minMZ',
    message: 'Set minimum m/z:',
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
    message: 'Set maximum m/z:',
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
    name: 'filterSpectrum',
    message:
      'Filter spectrum based on type, MS level and polarity, and/or exclude spectra?',
    default: false,
  },
  {
    type: 'checkbox',
    name: 'spectrumType',
    message: 'Select spectrum type to filter for:',
    choices: ['profile', 'centroid'],
    default: ['profile', 'centroid'],
    when: (answers) => answers.filterSpectrum,
  },
  {
    type: 'input',
    name: 'msLevel',
    message: 'Specify MS level to filter for (space-separated numbers):',
    default: '1 2',
    validate: (msLevel) => {
      const levels = msLevel.split(' ').map(Number);
      if (levels.some(isNaN)) {
        return 'Please enter a space-separated list of numbers';
      } else if (levels.some((num) => num <= 0)) {
        return 'Please enter only numbers greater than 0';
      } else if (new Set(levels).size !== levels.length) {
        return 'Please enter unique numbers';
      }
      return true;
    },
    when: (answers) => answers.filterSpectrum,
  },
  {
    type: 'checkbox',
    name: 'spectrumPolarity',
    message: 'Select spectrum polarity to filter for:',
    choices: ['positive', 'negative'],
    default: ['positive', 'negative'],
    when: (answers) => answers.filterSpectrum,
  },
  {
    type: 'confirm',
    name: 'excludeSpectra',
    message: 'Exclude spectra (m/z and intensity values) from output file?',
    default: false,
    when: (answers) => answers.filterSpectrum,
  },
];

export { prompts };
