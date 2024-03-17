/**
 * Extract the m/z value from the spectra contributing to the highest intensity (base peak intensity).
 * @param {number[]} mzArray An array of m/z values.
 * @param {number[]} intensityArray An array of intensity values.
 * @returns {Promise<number>} A promise that resolves with a number representing the m/z contributing to the highest intensity value in the spectra.
 */
export async function extractBasePeakMZ(mzArray, intensityArray) {
  const maxIntensityIndex = intensityArray.reduce(
    (maxIndex, intensity, currentIndex) => {
      return intensity > intensityArray[maxIndex] ? currentIndex : maxIndex;
    },
    0,
  );

  const basePeakMZ = mzArray[maxIntensityIndex];
  return basePeakMZ;
}
