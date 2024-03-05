import { parseTargetFile } from './parseTargetFile.js';
import { roundDecimalPlace } from './roundDecimalPlace.js';

/**
 *
 * @param {Object} configParam Configuration parameters passed via the command line interface.
 * @returns {Promise<Object>} A promise that resolves when data required for spectra filtering is established.
 */
export async function setForSpectraFiltering(configParam) {
  configParam.decimalPlace = Number(configParam.decimalPlace);

  // If targeted m/z filtering is defined
  if (configParam.targeted) {
    configParam.mzTolerance = Number(configParam.mzTolerance);
    configParam.ppmTolerance = Number(configParam.ppmTolerance);

    // Parse target file containing the targeted m/z values to filter for
    const targetFile = await parseTargetFile(configParam);
    configParam.mzTargetList = targetFile.mzTargetList;
    configParam.minMZ = targetFile.minMZ;
    configParam.maxMZ = targetFile.maxMZ;
  }

  // If m/z range filtering is defined
  if (configParam.mzRange) {
    configParam.minMZ = Number(configParam.minMZ);
    configParam.maxMZ = Number(configParam.maxMZ);

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
