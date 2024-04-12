/**
 * @typedef {import('../typedef/index.mjs').Chromatogram} Chromatogram
 */

/**
 * Initialise chromatogram array (specifically to accommodate for targeted m/z filtering).
 * @param {Object} configParam Configuration parameters.
 * @returns {Promise<Chromatogram[]>} A promise that resolves with an array of chromatogram data.
 */
export async function initChromatogramArray(configParam) {
  // Basic chromatogram array to store data for TIC and BPC (applicable to both non-targeted and targeted)
  const basicArray = [
    {
      index: 0,
      id: 'TIC',
      arrayLength: null,
      type: 'total ion current chromatogram',
      polarity: null,
      dwellTime: null,
      precursorIsolationWindowTarget: null,
      collisionType: null,
      collisionEnergy: null,
      productIsolationWindowTarget: null,
      timeArray: [],
      intensityArray: [],
      msLevelArray: [],
      mzArray: [],
    },
    {
      index: 1,
      id: 'BPC',
      arrayLength: null,
      type: 'base peak chromatogram',
      polarity: null,
      dwellTime: null,
      precursorIsolationWindowTarget: null,
      collisionType: null,
      collisionEnergy: null,
      productIsolationWindowTarget: null,
      timeArray: [],
      intensityArray: [],
      msLevelArray: [],
      mzArray: [],
    },
  ];

  // Check if targeted m/z filtering is defined for
  /**
   * @type {Chromatogram[]}
   */
  let chromatogram;
  if (configParam.targeted) {
    // If defined, initialise chromatogram objects to store data for each target m/z in addition to the basic chromatogram array
    chromatogram = [
      ...basicArray,
      ...configParam.mzTargetList.map((value, index) => ({
        index: basicArray.length + index,
        id: `EIC ${value}`,
        arrayLength: null,
        type: 'extracted ion chromatogram',
        polarity: null,
        dwellTime: null,
        precursorIsolationWindowTarget: null,
        collisionType: null,
        collisionEnergy: null,
        productIsolationWindowTarget: null,
        timeArray: [],
        intensityArray: [],
        msLevelArray: [],
        mzArray: [],
      })),
    ];
  } else {
    // If not defined, initialise with basic chromatogram array
    chromatogram = basicArray;
  }

  return chromatogram;
}
