import { describe, test, expect } from 'vitest';

import { initChromatogramArray } from '../utils/initChromatogramArray.js';

/**
 * To test initChromatogramArray function
 * Input: configParam (Object)
 * Output: An array structure to store extracted chromatogram data in a standardised manner (Chromatogram[])
 */
describe('initChromatogramArray', () => {
  // Dummy data
  const testBasicChromatogram = [
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
  const testConfigParam = {
    targeted: false,
    mzTargetList: [
      70.0647, 90.7658, 110.0704, 116.0494, 116.0714, 158.9637, 165.09,
      171.0546, 175.1197, 188.0705, 226.951, 232.1081, 237.1005, 239.6082,
      244.108, 246.0877, 248.115, 249.0909, 260.1036, 264.1091, 274.1174,
      276.0975, 280.1055, 286.1185, 288.1334, 290.1126, 291.0659, 292.0744,
      292.1335, 294.1479, 294.9379, 295.0755, 295.124, 296.0693, 296.0828,
      302.1138, 302.1493, 303.1084, 304.0938, 306.0912, 309.1025, 309.1163,
      309.166, 317.1243, 318.1097, 320.1076, 324.1223, 324.1364, 326.1191,
      326.1248, 332.1235, 335.1362, 336.1348, 340.1412, 345.1658, 346.15,
      346.1617, 351.1685, 352.1288, 355.1745, 362.1565, 362.9252, 375.1462,
      388.1759, 430.9147, 473.1919, 478.211, 487.2082, 498.8997, 501.2427,
      566.8877, 634.8755, 702.8645, 770.8527, 838.8367, 906.8243, 974.8154,
      1042.8006, 1110.788, 1178.7754, 1246.7628, 1314.7503, 1382.7377,
      1450.7251, 1518.7125,
    ],
  };
  const testTargetedChromatogram = [
    ...testBasicChromatogram,
    ...testConfigParam.mzTargetList.map((value, index) => ({
      index: testBasicChromatogram.length + index,
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

  // Tests
  test('return Chromatogram[]: default', async () => {
    const chromatogram = await initChromatogramArray(testConfigParam);
    expect(chromatogram).toHaveLength(testBasicChromatogram.length);
    expect(chromatogram[0].index).toStrictEqual(testBasicChromatogram[0].index);
    expect(chromatogram[0].id).toStrictEqual(testBasicChromatogram[0].id);
    expect(chromatogram[0].arrayLength).toStrictEqual(
      testBasicChromatogram[0].arrayLength,
    );
    expect(chromatogram[0].chromatogramType).toStrictEqual(
      testBasicChromatogram[0].chromatogramType,
    );
    expect(chromatogram[0].polarity).toStrictEqual(
      testBasicChromatogram[0].polarity,
    );
    expect(chromatogram[0].dwellTime).toStrictEqual(
      testBasicChromatogram[0].dwellTime,
    );
    expect(chromatogram[0].isolationWindowTarget).toStrictEqual(
      testBasicChromatogram[0].isolationWindowTarget,
    );
    expect(chromatogram[0].collisionType).toStrictEqual(
      testBasicChromatogram[0].collisionType,
    );
    expect(chromatogram[0].collisionEnergy).toStrictEqual(
      testBasicChromatogram[0].collisionEnergy,
    );
    expect(chromatogram[0].timeArray).toStrictEqual(
      testBasicChromatogram[0].timeArray,
    );
    expect(chromatogram[0].intensityArray).toStrictEqual(
      testBasicChromatogram[0].intensityArray,
    );
    expect(chromatogram[0].msLevelArray).toStrictEqual(
      testBasicChromatogram[0].msLevelArray,
    );
    expect(chromatogram[0].mzArray).toStrictEqual(
      testBasicChromatogram[0].mzArray,
    );
  });

  test('return Chromatogram[]: targeted', async () => {
    testConfigParam.targeted = true;
    const chromatogram = await initChromatogramArray(testConfigParam);
    expect(chromatogram).toHaveLength(testTargetedChromatogram.length);
    expect(chromatogram[3].index).toStrictEqual(
      testTargetedChromatogram[3].index,
    );
    expect(chromatogram[3].id).toStrictEqual(testTargetedChromatogram[3].id);
    expect(chromatogram[3].arrayLength).toStrictEqual(
      testTargetedChromatogram[3].arrayLength,
    );
    expect(chromatogram[3].chromatogramType).toStrictEqual(
      testTargetedChromatogram[3].chromatogramType,
    );
    expect(chromatogram[3].polarity).toStrictEqual(
      testTargetedChromatogram[3].polarity,
    );
    expect(chromatogram[3].dwellTime).toStrictEqual(
      testTargetedChromatogram[3].dwellTime,
    );
    expect(chromatogram[3].isolationWindowTarget).toStrictEqual(
      testTargetedChromatogram[3].isolationWindowTarget,
    );
    expect(chromatogram[3].collisionType).toStrictEqual(
      testTargetedChromatogram[3].collisionType,
    );
    expect(chromatogram[3].collisionEnergy).toStrictEqual(
      testTargetedChromatogram[3].collisionEnergy,
    );
    expect(chromatogram[3].timeArray).toStrictEqual(
      testTargetedChromatogram[3].timeArray,
    );
    expect(chromatogram[3].intensityArray).toStrictEqual(
      testTargetedChromatogram[3].intensityArray,
    );
    expect(chromatogram[3].msLevelArray).toStrictEqual(
      testTargetedChromatogram[3].msLevelArray,
    );
    expect(chromatogram[3].mzArray).toStrictEqual(
      testTargetedChromatogram[3].mzArray,
    );
  });
});
