/* eslint-disable no-await-in-loop */
// @ts-nocheck

/**
 * @typedef {import('../typedef/index.mjs').Chromatogram} Chromatogram
 */

import { roundDecimalPlace } from './roundDecimalPlace.js';

/**
 * Filter spectra (m/z and intensity) by range or targeted m/z filtering.
 * @param {Object} configParam Configuration parameters.
 * @param {string} type Spectrum type.
 * @param {number} msLevel MS level.
 * @param {string} polarity Spectrum polarity.
 * @param {number} retentionTime Retention time.
 * @param {number[]} mzArray An array of m/z values.
 * @param {number[]} intensityArray An array of intensity values.
 * @param {Chromatogram[]} chromatogram An initialised array of objects to store chromatogram data.
 * @returns {Promise<Object>} A promise that resolves with an object containing the extracted chromatogram array (if targeted m/z filtering is defined), base peak intensity, base peak m/z, total ion current, m/z array and intensity array.
 */
export async function filterSpectra(
  configParam,
  type,
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
  const mzValues = [];
  const intensityValues = [];

  // Check for defined spectra filtering method
  if (configParam.mzRange) {
    // If m/z range filtering
    // Set m/z range boundaries (minMZ and maxMZ)
    const minMZ = configParam.minMZ;
    const maxMZ = isNaN(configParam.maxMZ)
      ? mzArray.reduce((max, num) => {
          return num > max ? num : max;
        }, mzArray[0])
      : configParam.maxMZ;

    // Loop through m/z array
    for (let i = 0; i < mzArray.length; i++) {
      const mz = mzArray[i];
      const intensity = intensityArray[i];

      // Check if m/z falls within range (New filtered m/z and intensity array)
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
  } else if (configParam.targeted) {
    // If targeted m/z filtering
    // Loop through m/z target list
    for (const targetMZ of configParam.mzTargetList) {
      // Set new m/z range (minMZ & maxMZ) based on the accepted mass (m/z) difference/tolerance between the identified and true m/z value
      // Calculate accepted mass error based on defined mass accuracy (ppm) tolerance
      const acceptedMzTolerance = Math.abs(
        (configParam.ppmTolerance / 1e6) * targetMZ,
      );
      const tolerance = Math.max(acceptedMzTolerance, configParam.mzTolerance);
      let minMZ = targetMZ - tolerance;
      let maxMZ = targetMZ + tolerance;

      // Round minMZ and maxMZ if decimal place is configured
      if (!isNaN(configParam.decimalPlace)) {
        minMZ = await roundDecimalPlace(minMZ, configParam.decimalPlace);
        maxMZ = await roundDecimalPlace(maxMZ, configParam.decimalPlace);
      }

      // Initialise accepted mass accuracy (ppm) based on defined m/z or ppm tolerance values
      // Initialise m/z and intensity values
      let acceptedMassAccuracy =
        configParam.mzTolerance > acceptedMzTolerance
          ? Math.abs((configParam.mzTolerance / targetMZ) * 1e6)
          : configParam.ppmTolerance;
      let mz = 0;
      let intensity = 0;

      // Loop through m/z array
      for (let j = 0; j < mzArray.length; j++) {
        const potentialMZ = mzArray[j];
        const potentialIntensity = intensityArray[j];

        // Check if m/z falls within range
        if (potentialMZ >= minMZ && potentialMZ <= maxMZ) {
          // Calculate mass accuracy (ppm)
          const currentMassAccuracy = Math.abs(
            ((potentialMZ - targetMZ) / targetMZ) * 1e6,
          );

          // If mass accuracy (ppm) of current potential m/z is closer to 0 than previous accepted mass accuracy (ppm)
          if (currentMassAccuracy < acceptedMassAccuracy) {
            acceptedMassAccuracy = currentMassAccuracy;
            mz = potentialMZ;
            intensity = potentialIntensity;
          }
        }
      }

      // Amend spectrum information based on the filtered target m/z and intensity value: basePeakIntensity, basePeakMZ, totalIonCurrent, mzValues[], intensityValues[]
      // Gap-filling = 0 for target m/z that is not found within the m/z filtering range and mass accuracy threshold
      mz = mz === 0 ? targetMZ : mz;
      if (intensity > basePeakIntensity) {
        basePeakIntensity = intensity;
        basePeakMZ = mz;
      }
      totalIonCurrent += intensity;
      mzValues.push(mz);
      intensityValues.push(intensity);

      // Append chromatogram data (Extracted Ion Chromatogram) for target m/z
      const idx = chromatogram.findIndex(
        (chromObj) => chromObj.id === `EIC ${targetMZ}`,
      );
      if (configParam.filterSpectrum) {
        if (
          configParam.spectrumType.includes(type) &&
          configParam.msLevel.includes(msLevel) &&
          configParam.spectrumPolarity.includes(polarity)
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
