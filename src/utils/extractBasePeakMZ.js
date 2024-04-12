/**
 * Extract the m/z value (base peak m/z) corresponding to the highest intensity (base peak intensity).
 * @param {number[]} mzArray An array of m/z values.
 * @param {number[]} intensityArray An array of intensity values.
 * @returns {Promise<number>} A promise that resolves with the m/z value corresponding to the highest intensity.
 */
export async function extractBasePeakMZ(mzArray, intensityArray) {
  // Identify the index of the highest intensity in the intensity array
  const maxIntensityIndex = intensityArray.reduce(
    (maxIndex, intensity, currentIndex) => {
      return intensity > intensityArray[maxIndex] ? currentIndex : maxIndex;
    },
    0,
  );

  // m/z value corresponding to the highest intensity value (base peak m/z)
  return mzArray[maxIntensityIndex];
}
