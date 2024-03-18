import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { describe, test, expect, beforeAll } from 'vitest';

import { parseMZML } from '../utils/parseMZML.js';

/**
 * To test parseMZML()
 * Input: configParam (Object)
 * Output: NA || Error message (Error)
 */

describe('parseMZML', () => {
  // Dummy data
  const testConfigParam = {
    inputDirectory: './data/mzML/',
    fileList: ['test1.mzML'],
    outputFormat: 'JSON',
    outputDirectory: './.tmp/parseMZML/outputDirectory/',
    logDirectory: './.tmp/parseMZML/logDirectory/',
    decimalPlace: 4,
    targeted: false,
    mzRange: false,
    filterSpectrumData: false,
    spectrumType: ['centroid'],
    msLevel: [1, 2],
    polarity: ['positive'],
    excludeSpectra: false,
    mzTargetList: [
      70.065, 90.76644, 110.071, 116.0499, 116.0709, 158.964068, 165.089,
      171.055, 175.119, 188.0705, 226.951491, 232.1081, 237.1008, 239.6092,
      244.1081, 246.0873, 248.1157, 249.0911, 260.103, 264.1101, 274.1186,
      276.0979, 280.105, 286.1186, 288.1343, 290.1135, 291.0672, 292.075,
      292.1324, 294.1481, 294.938915, 295.0743, 295.124, 296.07, 296.0821,
      302.1135, 302.1499, 303.1088, 304.0928, 306.0907, 309.1033, 309.1163,
      309.1671, 317.1244, 318.1084, 320.1063, 324.1223, 324.1353, 326.1201,
      326.1248, 332.1241, 335.136, 336.1343, 340.1404, 345.167, 346.151,
      346.1615, 351.1678, 352.1292, 355.1752, 362.1564, 362.926338, 375.1452,
      388.1761, 430.913762, 473.1932, 478.21, 487.2088, 498.901186, 501.2432,
      566.888609, 634.876033, 702.863456, 770.85088, 838.838303, 906.825727,
      974.81315, 1042.800574, 1110.787998, 1178.775421, 1246.762845,
      1314.750268, 1382.737692, 1450.725115, 1518.712539,
    ],
    minMZ: 70.06,
    maxMZ: 1518.7175,
  };
  const testFile = [
    'S36_XEVOG2XSQToF_REIMS.mzML',
    'S41_SCIEX_QTRAP6500P_TQMS_Old.mzML',
    'S15_Bruker_ImpactII_QToFMS.mzML',
  ];

  // Setting up test environment before tests
  beforeAll(() => {
    // Output directory
    if (!existsSync(testConfigParam.outputDirectory)) {
      mkdirSync(testConfigParam.outputDirectory, { recursive: true });
    }

    // For TSV - spectrum and chromatogram output
    const spectrumOutputPath = join(
      testConfigParam.outputDirectory,
      'spectrum/',
    );
    const chromatogramOutputPath = join(
      testConfigParam.outputDirectory,
      'chromatogram/',
    );
    if (!existsSync(spectrumOutputPath)) {
      mkdirSync(spectrumOutputPath, { recursive: true });
    }
    if (!existsSync(chromatogramOutputPath)) {
      mkdirSync(chromatogramOutputPath, { recursive: true });
    }

    // Log directory
    if (!existsSync(testConfigParam.logDirectory)) {
      mkdirSync(testConfigParam.logDirectory, { recursive: true });
    }
  });

  // Tests
  test('throw error: file not found in input directory', async () => {
    await expect(parseMZML(testConfigParam)).rejects.toThrowError(
      '\nExtraction failure: test1.mzML',
    );
  });

  test('file found parsed successfully', async () => {
    testConfigParam.fileList = testFile;
    // JSON
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  // ! Fail to catch writeLog() error - Code won't reach: writeLog.js line 14, 16-17
  // ! If writeLog() throws an error - it is caught and handled within parseMZML()
  // ! writeLog() unit test is conducted and covers all lines
});
