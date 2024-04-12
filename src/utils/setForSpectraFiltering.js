import { parseTargetFile } from './parseTargetFile.js';
import { roundDecimalPlace } from './roundDecimalPlace.js';

/**
 * Set parameters required for spectra filtering based on defined method (targeted m/z or m/z range filtering).
 * @param {Object} configParam Configuration parameters.
 * @returns {Promise<Object>} A promise that resolves with updated configuration parameters required for spectra filtering.
 * @throws {Error} Throws error if setForSpectraFiltering() encounters issues in its process.
 */
export async function setForSpectraFiltering(configParam) {
  // Determine the spectra filtering method defined
  if (configParam.targeted) {
    // If targeted m/z filtering
    // Determine if mzTolerance and ppmTolerance defined is either a number or NaN
    configParam.mzTolerance = Number(configParam.mzTolerance);
    configParam.ppmTolerance = Number(configParam.ppmTolerance);

    // Parse target file containing the targeted m/z values to filter for
    const targetFile = await parseTargetFile(configParam);
    configParam.mzTargetList = targetFile.mzTargetList;
    configParam.minMZ = targetFile.minMZ;
    configParam.maxMZ = targetFile.maxMZ;
  } else if (configParam.mzRange) {
    // If m/z range filtering
    // Determine if minMZ and maxMZ is either a number or NaN
    configParam.minMZ = Number(configParam.minMZ);
    configParam.maxMZ = Number(configParam.maxMZ);

    // Round minMZ and maxMZ to specific decimal place if specified
    if (!isNaN(configParam.decimalPlace)) {
      configParam.minMZ = await roundDecimalPlace(
        configParam.minMZ,
        configParam.decimalPlace,
      );
      if (!isNaN(configParam.maxMZ)) {
        configParam.maxMZ = await roundDecimalPlace(
          configParam.maxMZ,
          configParam.decimalPlace,
        );
      }
    }
  }

  return configParam;
}
