import { configParam } from '../bin/exfilms.js';

import { roundDecimalPlace } from './roundDecimalPlace.js';

// Filter spectrum array (m/z and intensity)
export async function filterSpectrumArray(
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

  // Check to filter for general m/z or targeted m/z data array
  if (!configParam.targetedAssay) {
    // Set m/z range (minMZ and maxMZ)
    const minMZ = configParam.minMZ;
    const maxMZ = isNaN(configParam.maxMZ)
      ? mzArray.reduce((max, num) => {
          return num > max ? num : max;
        }, mzArray[0])
      : configParam.maxMZ;

    // Loop through spectrum data array
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
  } else {
    // Loop through m/z target list
    for (const targetMZ of configParam.mzTargetList) {
      // Set new m/z range (minMZ & maxMZ) based on target m/z
      const ppmTolerance = Math.abs((configParam.ppm / 1e6) * targetMZ);
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
          : configParam.ppm;
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

      // New filtered spectrum data
      mz = mz === 0 ? targetMZ : mz;
      if (intensity > basePeakIntensity) {
        basePeakIntensity = intensity;
        basePeakMZ = mz;
      }
      totalIonCurrent += intensity;
      mzValues.push(mz);
      intensityValues.push(intensity);

      // Store chromatogram data for target m/z based on spectrum filter applied
      const idx = chromatogram.findIndex(
        (chromObj) => chromObj.id === `EIC ${targetMZ}`,
      );
      if (configParam.filterSpectrum) {
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
