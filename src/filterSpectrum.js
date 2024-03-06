/* eslint-disable no-await-in-loop */

import { roundDecimalPlace } from './roundDecimalPlace.js';

/**
 * Filter the spectra within each spectrum data by range or targeted filtering.
 * @param {Object} configParam Configuration parameters passed via the command line interface.
 * @param {string} spectrumType
 * @param {number} msLevel
 * @param {string} polarity
 * @param {number} retentionTime
 * @param {number[]} mzArray An array representing the m/z values detected in a spectrum
 * @param {number[]} intensityArray An array representing the intensity values of the respective m/z values in a spectrum.
 * @param {array} chromatogram An array of chromatogram data defined by initChromatogramArray to be used for the extraction (and filtration) process.
 * @returns {Promise<Object>} A promise that resolves with an object containing the chromatogram array, base peak intensity, base peak m/z, total ion current, and spectra array (m/z and intensity values)
 */
export async function filterSpectrum(
  configParam,
  spectrumType,
  msLevel,
  polarity,
  retentionTime,
  mzArray,
  intensityArray,
  chromatogram,
) {
  let basePeakIntensity = 0;
  let basePeakMZ = 0;
  let totalIonCurrent = 0;
  let mzValues = [];
  let intensityValues = [];

  let mz, intensity;

  // Check to execute m/z range or targeted m/z filtering
  // If m/z range filtering
  if (!configParam.targeted) {
    // Set m/z range boundaries (minMZ and maxMZ)
    const minMZ = configParam.minMZ;
    const maxMZ = isNaN(configParam.maxMZ)
      ? mzArray.reduce((max, num) => {
          return num > max ? num : max;
        }, mzArray[0])
      : configParam.maxMZ;

    // Loop through spectra array
    for (let i = 0; i < mzArray.length; i++) {
      mz = mzArray[i];
      intensity = intensityArray[i];

      // Check if m/z falls within range (New filtered spectrum data)
      if (mz >= minMZ && mz <= maxMZ) {
        if (intensity > basePeakIntensity) {
          basePeakIntensity = intensity;
          basePeakMZ = mz;
        }
        totalIonCurrent += intensity;
        mzValues.push(mz);
        intensityValues.push(intensity);
      }
    }
  } // If targeted m/z filtering
  else {
    // Loop through m/z target list
    for (const targetMZ of configParam.mzTargetList) {
      // Set new m/z range (minMZ & maxMZ) based on target m/z
      const ppmTolerance = Math.abs(
        (configParam.ppmTolerance / 1e6) * targetMZ,
      );
      const tolerance = Math.max(ppmTolerance, configParam.mzTolerance);
      let minMZ = targetMZ - tolerance;
      let maxMZ = targetMZ + tolerance;

      // Round minMZ and maxMZ if decimal place is configured
      if (!isNaN(configParam.decimalPlace)) {
        minMZ = await roundDecimalPlace(minMZ, configParam.decimalPlace);
        maxMZ = await roundDecimalPlace(maxMZ, configParam.decimalPlace);
      }

      // Initialise mass accuracy (based on ppm or m/z tolerance), m/z and intensity value
      let massPPM =
        configParam.mzTolerance > ppmTolerance
          ? Math.abs((configParam.mzTolerance / targetMZ) * 1e6)
          : configParam.ppmTolerance;
      mz = 0;
      intensity = 0;

      // Loop through spectrum data array
      for (let j = 0; j < mzArray.length; j++) {
        const potentialMZ = mzArray[j];
        const potentialIntensity = intensityArray[j];

        // Check if m/z falls within range
        if (potentialMZ >= minMZ && potentialMZ <= maxMZ) {
          // Calculate mass accuracy (ppm)
          const massAccuracy = Math.abs(
            ((potentialMZ - targetMZ) / targetMZ) * 1e6,
          );

          // If mass accuracy (ppm) of current m/z is closer to 0 than the previous m/z
          if (massAccuracy < massPPM) {
            massPPM = massAccuracy;
            mz = potentialMZ;
            intensity = potentialIntensity;
          }
        }
      }

      // New filtered spectra (Gap-filling for targeted m/z that is not found in filtering range)
      mz = mz === 0 ? targetMZ : mz;
      if (intensity > basePeakIntensity) {
        basePeakIntensity = intensity;
        basePeakMZ = mz;
      }
      totalIonCurrent += intensity;
      mzValues.push(mz);
      intensityValues.push(intensity);

      // Append chromatogram data (Extracted Ion Chromatogram) for targeted m/z based on spectrum data filter applied
      const idx = chromatogram.findIndex(
        (chromObj) => chromObj.id === `EIC ${targetMZ}`,
      );
      if (configParam.filterSpectrumData) {
        if (
          configParam.spectrumType.includes(spectrumType) &&
          configParam.msLevel.includes(msLevel) &&
          configParam.polarity.includes(polarity)
        ) {
          chromatogram[idx].timeArray.push(retentionTime);
          chromatogram[idx].intensityArray.push(intensity);
          chromatogram[idx].msLevelArray.push(msLevel);
          chromatogram[idx].mzArray.push(mz);
        }
      } else {
        chromatogram[idx].timeArray.push(retentionTime);
        chromatogram[idx].intensityArray.push(intensity);
        chromatogram[idx].msLevelArray.push(msLevel);
        chromatogram[idx].mzArray.push(mz);
      }
    }
  }

  return {
    chromatogram,
    basePeakIntensity,
    basePeakMZ,
    totalIonCurrent,
    mzValues,
    intensityValues,
  };
}
