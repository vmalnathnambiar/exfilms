import { existsSync, statSync } from 'fs';
import { homedir } from 'os';
import { join, basename } from 'path';

import { listMZML } from './listMZML.js';

// Inquirer interactive prompts
const prompts = [
  {
    type: 'input',
    name: 'inputDir',
    message: 'Specify input directory containing mzML data files:',
    validate: (inputDir) => {
      if (!inputDir) {
        return 'Input directory is required';
      } else if (!existsSync(inputDir)) {
        return 'Input directory does not exist';
      } else if (!statSync(inputDir).isDirectory()) {
        return 'Input directory specified is not a directory';
      }
      return true;
    },
  },
  {
    type: 'checkbox',
    name: 'fileList',
    message: 'Select file(s) for extraction:\n',
    choices: async (answers) => {
      return listMZML(answers.inputDir);
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
    name: 'outputDir',
    message: 'Specify output directory:',
    default: async (answers) => {
      return join(homedir(), '/data/JSON/', `${basename(answers.inputDir)}/`);
    },
  },
  {
    type: 'input',
    name: 'logDir',
    message: 'Specify log directory:',
    default: join(homedir(), '/.exfil-ms/'),
  },
  {
    type: 'input',
    name: 'decimalPlace',
    message: 'Number of decimal places to round precision values to?',
    default: NaN,
  },
  {
    type: 'confirm',
    name: 'targetedAssay',
    message: 'Running targeted assay?',
    default: false,
  },
  {
    type: 'input',
    name: 'targetFile',
    message:
      'Specify a target file path (locally stored or published to web .tsv document) containing list of targeted ions and respective m/z value to look for:',
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
    when: (answers) => answers.targetedAssay,
  },
  {
    type: 'input',
    name: 'mzTolerance',
    message: 'Specify m/z tolerance range:',
    default: 0.005,
    validate: (mzTolerance) => {
      const tolerance = Number(mzTolerance);
      if (isNaN(tolerance)) {
        return 'Please enter a valid number';
      }
      return true;
    },
    when: (answers) => answers.targetedAssay,
  },
  {
    type: 'input',
    name: 'ppm',
    message: 'Specify accepted mass accuracy (ppm) range:',
    default: 5,
    validate: (ppm) => {
      const tolerance = Number(ppm);
      if (isNaN(tolerance)) {
        return 'Please enter a valid number';
      }
      return true;
    },
    when: (answers) => answers.targetedAssay,
  },
  {
    type: 'confirm',
    name: 'mzRange',
    message: 'Filter for a specific m/z value range?',
    default: false,
    when: (answers) => !answers.targetedAssay,
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
    name: 'filterSpectrum',
    message:
      'Filter spectrum based on type, MS levels and polarity, or exclude m/z data array?',
    default: false,
  },
  {
    type: 'checkbox',
    name: 'spectrumType',
    message: 'Select spectrum type to filter for?',
    choices: ['profile', 'centroid'],
    default: ['profile', 'centroid'],
    when: (answers) => answers.filterSpectrum,
  },
  {
    type: 'input',
    name: 'msLevel',
    message: 'Specify MS levels to filter for (space-separated)?',
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
    when: (answers) => answers.filterSpectrum,
  },
  {
    type: 'checkbox',
    name: 'polarity',
    message: 'Select spectrum polarity to filter for?',
    choices: ['positive', 'negative'],
    default: ['positive', 'negative'],
    when: (answers) => answers.filterSpectrum,
  },
  {
    type: 'confirm',
    name: 'excludeMzData',
    message: 'Exclude m/z data array (value and intensity)?',
    default: false,
    when: (answers) => answers.filterSpectrum,
  },
];

export { prompts };
