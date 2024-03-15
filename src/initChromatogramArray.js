/**
 * @typedef {import('./typedef.mjs').Chromatogram} Chromatogram
 */

/**
 * Initialise chromatogram array (specifically due to targeted m/z filtering).
 * @param {Object} configParam Configuration parameters passed via the command line interface.
 * @returns {Promise<Chromatogram[]>} A promise that resolves with an array structure to store the extracted chromatogram data
 */
export async function initChromatogramArray(configParam) {
  let chromatogram;

  // Basic chromatogram data (applicable to both non-targeted and targeted)
  const basicArray = [
    {
      index: 0,
      id: 'TIC',
      arrayLength: null,
      chromatogramType: 'total ion current chromatogram',
      polarity: null,
      dwellTime: null,
      isolationWindowTarget: null,
      collisionType: null,
      collisionEnergy: null,
      timeArray: [],
      intensityArray: [],
      msLevelArray: [],
      mzArray: [],
    },
    {
      index: 1,
      id: 'BPC',
      arrayLength: null,
      chromatogramType: 'base peak chromatogram',
      polarity: null,
      dwellTime: null,
      isolationWindowTarget: null,
      collisionType: null,
      collisionEnergy: null,
      timeArray: [],
      intensityArray: [],
      msLevelArray: [],
      mzArray: [],
    },
  ];

  // Check if targeted m/z filtering is defined for, additional chromatogram data required based on m/z target list
  if (configParam.targeted) {
    chromatogram = [
      ...basicArray,
      ...configParam.mzTargetList.map((value, index) => ({
        index: basicArray.length + index,
        id: `EIC ${value}`,
        arrayLength: null,
        chromatogramType: 'extracted ion chromatogram',
        polarity: null,
        dwellTime: null,
        isolationWindowTarget: null,
        collisionType: null,
        collisionEnergy: null,
        timeArray: [],
        intensityArray: [],
        msLevelArray: [],
        mzArray: [],
      })),
    ];
  } else {
    chromatogram = basicArray;
  }

  return chromatogram;
}
