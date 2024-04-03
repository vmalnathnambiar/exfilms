// @ts-nocheck

import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

import { describe, test, expect, beforeAll, afterAll } from 'vitest';

import { parseMZML } from '../utils/parseMZML.js';

/**
 * To test parseMZML() - and extractMZML(), extractSpectrum(), filterSpectra(), extractChromatogram()
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
    decimalPlace: NaN,
    targeted: false,
    mzRange: false,
    filterSpectrum: false,
    spectrumType: ['centroid'],
    msLevel: [1, 2],
    spectrumPolarity: ['positive'],
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
  const testFileBruker = [
    'S15_Bruker_ImpactII_QToFMS.mzML',
    'S16_Bruker_solariX_MRMS.mzML',
  ];
  const testFileWaters = [
    'S26_Waters_XEVOTQXS_TQMS.mzML',
    'S32_Waters_XEVOG2XSQToF_DESIMS.mzML',
    'S36_Waters_XEVOG2XSQToF_REIMS.mzML',
  ];
  const testFileSciex = [
    'S41_SCIEX_QTRAP6500P_TQMS_Old.mzML',
    'S46_SCIEX_QTRAP6500P_TQMS_New.mzML',
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

  test('extraction: Bruker', async () => {
    testConfigParam.fileList = testFileBruker;

    // JSON
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  test('extraction: Waters', async () => {
    testConfigParam.fileList = testFileWaters;

    // JSON
    testConfigParam.outputFormat = 'JSON';
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  test('extraction: Sciex', async () => {
    testConfigParam.fileList = testFileSciex;

    // JSON
    testConfigParam.outputFormat = 'JSON';
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  test('targeted m/z filtering: Bruker', async () => {
    testConfigParam.decimalPlace = 4;
    testConfigParam.targeted = true;
    testConfigParam.fileList = testFileBruker;

    // JSON
    testConfigParam.outputFormat = 'JSON';
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  test('targeted m/z filtering: Waters', async () => {
    testConfigParam.fileList = testFileWaters;

    // JSON
    testConfigParam.outputFormat = 'JSON';
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  test('targeted m/z filtering: Sciex', async () => {
    testConfigParam.fileList = testFileSciex;

    // JSON
    testConfigParam.outputFormat = 'JSON';
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  test('m/z range filtering: Bruker', async () => {
    testConfigParam.targeted = false;
    testConfigParam.mzRange = true;
    testConfigParam.maxMZ = NaN;
    testConfigParam.fileList = testFileBruker;

    // JSON
    testConfigParam.outputFormat = 'JSON';
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  test('m/z range filtering: Waters', async () => {
    testConfigParam.fileList = testFileWaters;

    // JSON
    testConfigParam.outputFormat = 'JSON';
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  test('m/z range filtering: Sciex', async () => {
    testConfigParam.fileList = testFileSciex;

    // JSON
    testConfigParam.outputFormat = 'JSON';
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  test('spectrum data filtering: Bruker', async () => {
    testConfigParam.targeted = true;
    testConfigParam.maxMZ = 1518.7175;
    testConfigParam.filterSpectrum = true;
    testConfigParam.excludeSpectra = true;
    testConfigParam.fileList = testFileBruker;

    // JSON
    testConfigParam.outputFormat = 'JSON';
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  test('spectrum data filtering: Waters', async () => {
    testConfigParam.fileList = testFileWaters;

    // JSON
    testConfigParam.outputFormat = 'JSON';
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  test('spectrum data filtering: Sciex', async () => {
    testConfigParam.fileList = testFileSciex;

    // JSON
    testConfigParam.outputFormat = 'JSON';
    expect(await parseMZML(testConfigParam));

    // TSV
    testConfigParam.outputFormat = 'TSV';
    expect(await parseMZML(testConfigParam));
  });

  test('catch error: logDirectory is not of type string', async () => {
    testConfigParam.fileList = ['S15_Bruker_ImpactII_QToFMS.mzML'];
    testConfigParam.logDirectory = 0;
    expect(await parseMZML(testConfigParam));
  });

  // ! Uncovered Lines - extractChromatogram.js line 94-95, 128-129
  // Test data only consist of isolationWindowTarget for the mappedKey (Both precursor and product data)

  // ! Uncovered Lines - extractSpectrum.js line 69, 107, 150, 165
  // Line 69 - spectrumData.cvParam array check with test data is always true
  // Line 107 - scanWindowMap.cvParam array check with test data is always true
  // Line 150 - activationMap.cvParam array check with test data is always true
  // Line 165 - binaryData.cvParam array check with the test data is always true

  // ! Uncovered Lines - filterSpectra.js line 97-108, 115-117, 127-136
  // Line 95-108 - Calculation of mass accuracy if m/z falls within range works, but don't know why it doesn't pick up in test
  // Line 115-117 - Assignation of new basePeakIntensity and basePeakMZ works, but don't know why it doesn't pick up in test
  // Line 127-136 - Pushing chromatogram data based on spectrum data filtering works, but don't know why it doesn't pick up in test

  // ! Fail to catch decoder() input type error - Code won't reach: decoder.js line 15, 17, 19, 21, 23-24
  // If decoder() throws an error - it is caught and handled within parseMZML()
  // decoder() unit test is conducted and covers all lines

  // ! Fail to catch extractTimeStamp() input type error - Code won't reach: extractTimeStamp.js line 14-15
  // If extractTimeStamp() throws an error - it is caught and handled within parseMZML()
  // extractTimeStamp() unit test is conducted and covers all lines

  // ! Fail to catch roundDecimalPlace() input type error - Code won't reach: roundDecimalPlace.js line 11, 13-14
  // If roundDecimalPlace() throws an error - it is caught and handled within parseMZML()
  // roundDecimalPlace() unit test is conducted and covers all lines

  // ! Fail to catch writeJSON() input type error - Code won't reach: writeJSON.js line 18-19
  // ! Fail to catch writeJSON() date/time null writing to file - Code won't reach: writeJSON.js line 30-31, 36-37
  // If writeJSON() throws an error - it is caught and handled within parseMZML()
  // Test data files all have valid data and time extracted from parsed mzML data
  // writeJSON() unit test is conducted and covers all lines

  // ! Fail to catch writeLog() input type error - Code won't reach: writeLog.js line 16-17
  // If writeLog() throws an error - it is caught and handled within parseMZML()
  // writeLog() unit test is conducted and covers all lines

  // ! Fail to catch writeTSV() input type error - Code won't reach: writeTSV.js line 18-19
  // ! Fail to catch writeTSV() chromatogram === 0 writing to file - Code won't reach: writeTSV.js line 64-68
  // If writeTSV() throws an error - it is caught and handled within parseMZML()
  // Test data files all have chromatogram data > 0 from parsed mzML data
  // writeTSV() unit test is conducted and covers all lines

  // Clean up test environment after tests
  afterAll(() => {
    rmSync('./.tmp/parseMZML/', { recursive: true });
  });
});
