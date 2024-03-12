// @ts-nocheck

/**
 * @typedef {import('../../typedef.mjs').MS} MS
 */

import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';

import { describe, test, expect, beforeAll, afterAll } from 'vitest';

import { writeTSV } from '../writeTSV.js';

/**
 * To test writeTSV function
 * Input: outputDirectory (string), data (MS)
 * Output: NA
 */
describe('writeTSV', () => {
  // Dummy data
  /**
   * @type {MS}
   */
  const testData = {
    sampleID: 'testSample',
    date: '2022-08-17',
    time: '18:43:38',
    spectrumCount: 3,
    spectrum: [
      {
        index: 0,
        scanID: 'scan=1',
        arrayLength: 85,
        spectrumType: 'profile',
        msLevel: 1,
        scanType: 'MS1',
        polarity: 'positive',
        retentionTime: 0.0031,
        scanPresetConfiguration: null,
        scanWindowLowerLimit: 30,
        scanWindowUpperLimit: 1000,
        isolationWindowTarget: null,
        isolationWindowLowerOffset: null,
        isolationWindowUpperOffset: null,
        selectedIonMZ: null,
        collisionType: null,
        collisionEnergy: null,
        basePeakIntensity: 370,
        basePeakMZ: 171.0576,
        totalIonCurrent: 996,
        mzArray: [
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
        intensityArray: [
          0, 0, 92, 0, 120, 0, 0, 370, 0, 190, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 30, 46, 0, 0, 20, 0, 0, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 66, 0, 0, 0, 0,
          0, 0, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      },
      {
        index: 1,
        scanID: 'scan=2',
        arrayLength: 85,
        spectrumType: 'centroid',
        msLevel: 1,
        scanType: 'MS1',
        polarity: 'positive',
        retentionTime: 0.0052,
        scanPresetConfiguration: null,
        scanWindowLowerLimit: 30,
        scanWindowUpperLimit: 1000,
        isolationWindowTarget: null,
        isolationWindowLowerOffset: null,
        isolationWindowUpperOffset: null,
        selectedIonMZ: null,
        collisionType: null,
        collisionEnergy: null,
        basePeakIntensity: 390,
        basePeakMZ: 171.0553,
        totalIonCurrent: 1346,
        mzArray: [
          70.0642, 90.7664, 110.072, 116.0499, 116.0708, 158.9641, 165.089,
          171.0553, 175.119, 188.0693, 226.9515, 232.1124, 237.1008, 239.6092,
          244.1081, 246.0873, 248.1157, 249.0911, 260.103, 264.1135, 274.1186,
          276.0979, 280.105, 286.1174, 288.1343, 290.1135, 291.0672, 292.075,
          292.1324, 294.1481, 294.9389, 295.0743, 295.124, 296.07, 296.0821,
          302.1135, 302.1499, 303.1088, 304.0928, 306.0907, 309.1033, 309.1163,
          309.1671, 317.1244, 318.1084, 320.1063, 324.1223, 324.1353, 326.1201,
          326.1248, 332.1241, 335.136, 336.1343, 340.1404, 345.167, 346.151,
          346.1615, 351.1678, 352.1292, 355.1752, 362.1564, 362.9263, 375.1452,
          388.1761, 430.9138, 473.1932, 478.21, 487.2088, 498.9012, 501.2432,
          566.8886, 634.876, 702.8635, 770.8509, 838.8383, 906.8257, 974.8132,
          1042.8006, 1110.788, 1178.7754, 1246.7628, 1314.7503, 1382.7377,
          1450.7251, 1518.7125,
        ],
        intensityArray: [
          140, 0, 70, 0, 236, 0, 0, 390, 0, 318, 0, 40, 0, 0, 0, 0, 0, 0, 0, 64,
          0, 0, 0, 88, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      },
      {
        index: 2,
        scanID: 'scan=3',
        arrayLength: 85,
        spectrumType: 'centroid',
        msLevel: 2,
        scanType: 'MSn',
        polarity: 'positive',
        retentionTime: 0.0074,
        scanPresetConfiguration: null,
        scanWindowLowerLimit: 30,
        scanWindowUpperLimit: 1000,
        isolationWindowTarget: 515,
        isolationWindowLowerOffset: 485,
        isolationWindowUpperOffset: 485,
        selectedIonMZ: 515,
        collisionType: 'in-source collision-induced dissociation',
        collisionEnergy: 20,
        basePeakIntensity: 38150,
        basePeakMZ: 171.0552,
        totalIonCurrent: 50390,
        mzArray: [
          70.0651, 90.7664, 110.0705, 116.0497, 116.0709, 158.9641, 165.089,
          171.0552, 175.1206, 188.0705, 226.9559, 232.1081, 237.1008, 239.6092,
          244.1081, 246.0877, 248.1157, 249.0911, 260.1026, 264.1101, 274.1192,
          276.0979, 280.105, 286.1186, 288.1343, 290.1174, 291.0672, 292.075,
          292.1324, 294.1504, 294.9389, 295.0743, 295.124, 296.07, 296.0821,
          302.1179, 302.1499, 303.1088, 304.0928, 306.0907, 309.1033, 309.1163,
          309.1671, 317.1244, 318.1084, 320.1063, 324.1223, 324.1353, 326.1201,
          326.1282, 332.1241, 335.136, 336.1343, 340.1408, 345.1692, 346.151,
          346.1615, 351.1678, 352.1292, 355.1752, 362.1564, 362.9263, 375.1452,
          388.1761, 430.9138, 473.1932, 478.21, 487.2088, 498.9012, 501.2432,
          566.8886, 634.876, 702.8635, 770.8509, 838.8383, 906.8257, 974.8132,
          1042.8006, 1110.788, 1178.7754, 1246.7628, 1314.7503, 1382.7377,
          1450.7251, 1518.7125,
        ],
        intensityArray: [
          976, 0, 434, 4084, 0, 0, 0, 38150, 664, 0, 42, 0, 0, 0, 0, 16, 0, 0,
          234, 0, 2936, 0, 0, 0, 0, 42, 0, 0, 0, 28, 0, 0, 0, 0, 0, 24, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 0, 0, 0, 1858, 866, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0,
        ],
      },
    ],
    chromatogramCount: 2,
    chromatogram: [
      {
        index: 0,
        id: 'TIC',
        arrayLength: 3,
        chromatogramType: 'total ion current chromatogram',
        polarity: null,
        dwellTime: null,
        isolationWindowTarget: null,
        collisionType: null,
        collisionEnergy: null,
        timeArray: [0.0031, 0.0052, 0.0074],
        intensityArray: [996, 1346, 50390],
        msLevelArray: [1, 1, 2],
        mzArray: [],
      },
      {
        index: 1,
        id: 'BPC',
        arrayLength: 3,
        chromatogramType: 'base peak chromatogram',
        polarity: null,
        dwellTime: null,
        isolationWindowTarget: null,
        collisionType: null,
        collisionEnergy: null,
        timeArray: [0.0031, 0.0052, 0.0074],
        intensityArray: [370, 390, 38150],
        msLevelArray: [1, 1, 2],
        mzArray: [171.0546, 171.0553, 171.0552],
      },
    ],
  };
  const spectrum = testData.spectrum[0];
  const chromatogram = testData.chromatogram[0];

  const testOutputDirectory = './tmp/writeTSV/outputDirectory/';
  const testSpectrumDirectory = join(testOutputDirectory, 'spectrum/');
  const testChromatogramDirectory = join(testOutputDirectory, 'chromatogram/');
  const testSpectrumFile = join(
    testSpectrumDirectory,
    `${testData.sampleID}.tsv`,
  );
  const testChromatogramFile = join(
    testChromatogramDirectory,
    `${testData.sampleID}.tsv`,
  );
  const spectrumHeader =
    'sampleID\tdate\ttime\tspectrumCount\tindex\tscanID\tarrayLength\tspectrumType\tmsLevel\tscanType\tpolarity\tretentionTime\tscanPresetConfiguration\tscanWindowLowerLimit\tscanWindowUpperLimit\tisolationWindowTarget\tisolationWindowLowerOffset\tisolationWindowUpperOffset\tselectedIonMZ\tcollisionType\tcollisionEnergy\tbasePeakIntensity\tbasePeakMZ\ttotalIonCurrent\tmzArray\tintensityArray\n';
  const chromatogramHeader =
    'sampleID\tdate\ttime\tchromatogramCount\tindex\tid\tarrayLength\tchromatogramType\tpolarity\tdwellTime\tisolationWindowTarget\tcollisionType\tcollisionEnergy\ttimeArray\tintensityArray\tmsLevelArray\tmzArray\n';

  // Setting up test environment before tests
  beforeAll(() => {
    if (!existsSync(testSpectrumDirectory)) {
      mkdirSync(testSpectrumDirectory, { recursive: true });
    }

    if (!existsSync(testChromatogramDirectory)) {
      mkdirSync(testChromatogramDirectory, { recursive: true });
    }
  });

  // Tests
  test('throw error: outputDirectory is not of type string', async () => {
    await expect(writeTSV(0, testData)).rejects.toThrowError(
      '\nwriteTSV() - outputDirectory must be of type string',
    );
  });

  test('writeTSV: spectrum and chromatogram data > 0', async () => {
    expect(await writeTSV(testOutputDirectory, testData));

    // Spectrum data
    const testFirstSpectrum = `${testData.sampleID}\t${testData.date}\t${testData.time}\t${testData.spectrumCount}\t${spectrum.index}\t${spectrum.scanID}\t${spectrum.arrayLength}\t${spectrum.spectrumType}\t${spectrum.msLevel}\t${spectrum.scanType}\t${spectrum.polarity}\t${spectrum.retentionTime}\t${spectrum.scanPresetConfiguration}\t${spectrum.scanWindowLowerLimit}\t${spectrum.scanWindowUpperLimit}\t${spectrum.isolationWindowTarget}\t${spectrum.isolationWindowLowerOffset}\t${spectrum.isolationWindowUpperOffset}\t${spectrum.selectedIonMZ}\t${spectrum.collisionType}\t${spectrum.collisionEnergy}\t${spectrum.basePeakIntensity}\t${spectrum.basePeakMZ}\t${spectrum.totalIonCurrent}\t${spectrum.mzArray}\t${spectrum.intensityArray}\n`;
    let readData = readFileSync(testSpectrumFile, 'utf-8').split('\n');
    expect(readData[0].replace(/\s+/g, ' ').trim()).toStrictEqual(
      spectrumHeader.replace(/\s+/g, ' ').trim(),
    );
    expect(readData[1].replace(/\s+/g, ' ').trim()).toStrictEqual(
      testFirstSpectrum.replace(/\s+/g, ' ').trim(),
    );

    // Chromatogram data
    const testFirstChromatogram = `${testData.sampleID}\t${testData.date}\t${testData.time}\t${testData.chromatogramCount}\t${chromatogram.index}\t${chromatogram.id}\t${chromatogram.arrayLength}\t${chromatogram.chromatogramType}\t${chromatogram.polarity}\t${chromatogram.dwellTime}\t${chromatogram.isolationWindowTarget}\t${chromatogram.collisionType}\t${chromatogram.collisionEnergy}\t${chromatogram.timeArray}\t${chromatogram.intensityArray}\t${chromatogram.msLevelArray}\t${chromatogram.mzArray}\n`;
    readData = readFileSync(testChromatogramFile, 'utf-8').split('\n');
    expect(readData[0].replace(/\s+/g, ' ').trim()).toStrictEqual(
      chromatogramHeader.replace(/\s+/g, ' ').trim(),
    );
    expect(readData[1].replace(/\s+/g, ' ').trim()).toStrictEqual(
      testFirstChromatogram.replace(/\s+/g, ' ').trim(),
    );
  });

  test('writeTSV: spectrum and chromatogram data === 0', async () => {
    testData.spectrumCount = 0;
    testData.chromatogramCount = 0;
    expect(await writeTSV(testOutputDirectory, testData));

    // Spectrum data
    const testFirstSpectrum = `${testData.sampleID}\t${testData.date}\t${testData.time}\t${testData.spectrumCount}\n`;
    let readData = readFileSync(testSpectrumFile, 'utf-8').split('\n');
    expect(readData[0].replace(/\s+/g, ' ').trim()).toStrictEqual(
      spectrumHeader.replace(/\s+/g, ' ').trim(),
    );
    expect(readData[1].replace(/\s+/g, ' ').trim()).toStrictEqual(
      testFirstSpectrum.replace(/\s+/g, ' ').trim(),
    );

    // Chromatogram data
    const testFirstChromatogram = `${testData.sampleID}\t${testData.date}\t${testData.time}\t${testData.chromatogramCount}\n`;
    readData = readFileSync(testChromatogramFile, 'utf-8').split('\n');
    expect(readData[0].replace(/\s+/g, ' ').trim()).toStrictEqual(
      chromatogramHeader.replace(/\s+/g, ' ').trim(),
    );
    expect(readData[1].replace(/\s+/g, ' ').trim()).toStrictEqual(
      testFirstChromatogram.replace(/\s+/g, ' ').trim(),
    );
  });

  // Clean up test environment after tests
  afterAll(() => {
    rmSync('./tmp/writeTSV/', { recursive: true });
  });
});
