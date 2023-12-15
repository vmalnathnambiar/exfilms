// Extract base peak m/z
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
