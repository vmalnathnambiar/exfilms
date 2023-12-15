import { configParam } from '../bin/exfil-ms.js';

export async function initChromatogramArray() {
  let chromatogram;

  // Basic chromatogram data (applicable to both non-targeted and targeted assay)
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

  // Check if running targeted assay, additional chromatogram data required based on m/z target list
  if (configParam.targetedAssay) {
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
