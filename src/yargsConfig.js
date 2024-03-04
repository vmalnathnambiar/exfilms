/* eslint-disable no-undef */

import { existsSync, statSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Yargs config
const argv = yargs(hideBin(process.argv))
  .option('interactive', {
    alias: 'x',
    type: 'boolean',
    description: 'Run interactive mode',
  })
  .option('inputDirectory', {
    alias: 'i',
    type: 'string',
    description: 'Specify input directory containing mzML data files',
    coerce: (inputDirectory) => {
      if (!inputDirectory) {
        throw new Error('Input directory is required');
      } else if (!existsSync(inputDirectory)) {
        throw new Error('Input directory does not exist');
      } else if (!statSync(inputDirectory).isDirectory()) {
        throw new Error('Input directory specified is not a directory');
      }
      return inputDirectory;
    },
  })
  .option('fileList', {
    type: 'array',
    description:
      'List file(s) to process (space-separated strings of file names or "*" for all files)',
    default: '*',
  })
  .option('outputFormat', {
    alias: 'f',
    type: 'array',
    choices: ['JSON', 'TSV'],
    description: 'Specify output format',
    default: ['JSON'],
    coerce: (outputFormat) => {
      if (outputFormat.length === 0) {
        throw new Error('Output format is required');
      } else if (outputFormat.length > 1) {
        throw new Error('More than one output format specified');
      }
      return outputFormat;
    },
  })
  .option('outputDirectory', {
    alias: 'o',
    type: 'string',
    description: 'Specify output directory',
    default: join(homedir(), '/exfilms/outputFormat/inputDirectoryName/'),
  })
  .option('logDirectory', {
    alias: 'l',
    type: 'string',
    description: 'Specify log directory',
    default: join(homedir(), '/.exfilms/'),
  })
  .option('decimalPlace', {
    alias: 'd',
    type: 'number',
    description:
      'Specify number of decimal places to round precision values to',
    default: NaN,
  })
  .option('targeted', {
    alias: 't',
    type: 'boolean',
    description: 'Filter spectra for targeted m/z values',
    default: false,
  })
  .option('targetFile', {
    type: 'string',
    description:
      'Specify target file (locally stored path or published to web URL - tsv file)',
    coerce: (targetFile) => {
      const urlPattern = /^(?:http|https):\/\/[^ "]+&output=tsv$/;
      const tsvPattern = /\.tsv$/i;

      if (!targetFile) {
        throw new Error('Target file is required');
      } else if (!urlPattern.test(targetFile) && !tsvPattern.test(targetFile)) {
        throw new Error('Invalid target file input');
      } else if (tsvPattern.test(targetFile)) {
        if (!existsSync(targetFile)) {
          throw new Error('Target file does not exist');
        } else if (!statSync(targetFile).isFile()) {
          throw new Error('Target file specified is not a file');
        }
      }
      return targetFile;
    },
  })
  .option('mzTolerance', {
    type: 'number',
    description: 'Set accepted m/z tolerance',
    default: 0.005,
    coerce: (mzTolerance) => {
      if (isNaN(mzTolerance)) {
        throw new Error('m/z tolerance is not a valid number');
      }
      return mzTolerance;
    },
  })
  .option('ppmTolerance', {
    type: 'number',
    description: 'Set accepted mass accuracy (ppm) tolerance',
    default: 5,
    coerce: (ppmTolerance) => {
      if (isNaN(ppmTolerance)) {
        throw new Error('ppm tolerance is not a valid number');
      }
      return ppmTolerance;
    },
  })
  .option('mzRange', {
    alias: 'r',
    type: 'boolean',
    description: 'Filter spectra for specific m/z range',
    default: false,
  })
  .option('minMZ', {
    type: 'number',
    description: 'Set minimum m/z',
    default: 0,
    coerce: (minMZ) => {
      if (isNaN(minMZ)) {
        throw new Error('minMZ is not a valid number');
      }
      return minMZ;
    },
  })
  .option('maxMZ', {
    type: 'number',
    description: 'Set maximum m/z',
    default: NaN,
  })
  .option('filterSpectrumData', {
    alias: 's',
    type: 'boolean',
    description:
      'Filter spectrum data based on type, MS levels and polarity, and/or exclude spectra',
    default: false,
  })
  .option('spectrumType', {
    type: 'array',
    choices: ['profile', 'centroid'],
    description:
      'Specify spectrum type to filter for (space-separated strings)',
    default: ['profile', 'centroid'],
  })
  .option('msLevel', {
    type: 'array',
    description: 'Specify MS level(s) to filter for (space-separated numbers)',
    default: [1, 2],
    coerce: (msLevel) => {
      if (msLevel.some(isNaN)) {
        throw new Error('msLevel specified cannot be a non-integer value');
      } else if (msLevel.some((num) => num <= 0)) {
        throw new Error('msLevel specified needs to be greater than 0');
      } else if (new Set(msLevel).size !== msLevel.length) {
        throw new Error('msLevel specified are not unique');
      }
      return msLevel;
    },
  })
  .option('polarity', {
    type: 'array',
    choices: ['positive', 'negative'],
    description: 'Specify polarity to filter for (space-separated strings)',
    default: ['positive', 'negative'],
  })
  .option('excludeSpectra', {
    type: 'boolean',
    description: 'Exclude spectra (m/z and intensity values) from output file',
    default: false,
  })
  .usage('Usage: $0 <flags> <sub-flags>')
  .alias('help', 'h')
  .alias('version', 'v')
  .example('$0 -x', 'Run ExfilMS in interactive mode')
  .example(
    '$0 -i "/path/to/input/directory/"',
    'Run ExfilMS with default configurations',
  )
  .example(
    '$0 -i "/path/to/input/directory/" -f --spectrumType "centroid" --msLevel 1 2 --polarity "positive" "negative"',
    'Run ExfilMS configured to filter spectrum data for centroided MS1 and MS2 spectrum data with both polarity types',
  ).argv;

export { argv };
