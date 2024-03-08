/**
 * @typedef {import('../typedef.mjs').Yargs} Yargs
 */

import { setDefaults } from './setDefaults.js';

/**
 * Check if CLI arguments are used correctly
 * @param {Yargs} argv  Yargs command line arguments.
 * @returns {Promise<Object>} A promise that resolves when all checks have been completed and configParam object is created
 * @throws {?Error} Throws error if the target file parsing process encounters issues.
 */
export async function yargsCheck(argv) {
  let configParam = {};

  // Check command line arguments
  if (!argv.inputDirectory) {
    // If -i, --inputDirectory is not defined
    throw new Error(
      '\n-i (or --inputDirectory) "/path/to/input/directory/" required',
    );
  } else if (argv.targeted && argv.mzRange) {
    // If both -t, --targeted and -r, --mzRange is defined
    throw new Error(
      '\nUse one of the following options for m/z value range filtering:\n-t (or --targeted) --targetFile "/local/path/or/published/to/web/URL/to/target/tsv/file" --mzTolerance <number> --ppmTolerance <number>\n-r (or --mzRange) --minMZ <number> --maxMZ <number>',
    );
  } else if (argv.targeted && !argv.targetFile) {
    // If -t, --targeted is defined but --targetFile is not defined
    throw new Error('\n--targetFile "/path/to/target/file.tsv" required');
  } else if (
    !argv.targeted &&
    (argv.targetFile || argv.mzTolerance !== 0.005 || argv.ppmTolerance !== 5)
  ) {
    // If either or all --targetFile, --mzTolerance and --ppmTolerance are defined (not default values) without -t, --targeted
    throw new Error(
      '\n-t (or --targeted) required to specify --targetFile, --mzTolerance and --ppmTolerance',
    );
  } else if (!argv.mzRange && (argv.minMZ !== 0 || argv.maxMZ)) {
    // If either or all --minMZ and --maxMZ are defined without -r, --mzRange
    throw new Error(
      '\n-r (or --mzRange) required to specify --minMZ and --maxMZ',
    );
  } else if (!isNaN(argv.maxMZ) && argv.maxMZ <= argv.minMZ) {
    // If --maxMZ value defined is a number and is smaller than --minMZ value
    throw new Error('\nmaxMZ value needs to be greater than minMZ value');
  } else if (
    !argv.filterSpectrumData &&
    (argv.spectrumType.length !== 2 ||
      !(
        argv.msLevel.length === 2 &&
        argv.msLevel[0] === 1 &&
        argv.msLevel[1] === 2
      ) ||
      argv.polarity.length !== 2 ||
      argv.excludeSpectra)
  ) {
    // If either or all --spectrumType, --msLevel, --polarity and --excludeSpectra are defined (not default values) without -s, --filterSpectrumData
    throw new Error(
      '\n-s (or --filterSpectrumData) required to specify --spectrumType, --msLevel, --polarity and --excludeSpectra',
    );
  } else {
    // Set default values (where required)
    configParam = await setDefaults(argv);
  }

  return configParam;
}
