import { parseTargetFile } from './parseTargetFile.js';
import { roundDecimalPlace } from './roundDecimalPlace.js';

/**
 * Set parameters required for spectra filtering based on defined method.
 * @param {Object} configParam Configuration parameters passed via the command line interface.
 * @returns {Promise<Object>} A promise that resolves when data required for spectra filtering is established.
 * @throws {Error} Throws error if setForSpectraFiltering() encounters issues in its process.
 */
export async function setForSpectraFiltering(configParam) {
  // Determine the spectra filtering method defined
  if (configParam.targeted) {
    // If targeted m/z filtering
    configParam.mzTolerance = Number(configParam.mzTolerance);
    configParam.ppmTolerance = Number(configParam.ppmTolerance);

    // Parse target file containing the targeted m/z values to filter for
    const targetFile = await parseTargetFile(configParam);
    configParam.mzTargetList = targetFile.mzTargetList;
    configParam.minMZ = targetFile.minMZ;
    configParam.maxMZ = targetFile.maxMZ;
  } else if (configParam.mzRange) {
    // If m/z range filtering
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
