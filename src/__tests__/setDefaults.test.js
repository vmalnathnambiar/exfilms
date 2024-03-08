// @ts-nocheck

/**
 * @typedef {import('../../typedef.mjs').Yargs} Yargs
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join, basename } from 'path';

import { describe, test, expect, beforeAll, afterAll } from 'vitest';

import { setDefaults } from '../setDefaults.js';

/**
 * To test setDefaults function
 * Input: argv (Yargs)
 * Output: configParam (Object?)
 */
describe('setDefaults Check', () => {
  // Dummy data
  /**
   * @type {Yargs}
   */
  const testArgv = {
    interactive: false,
    inputDirectory: './tmp/setDefaults/',
    fileList: ['*'],
    outputFormat: ['JSON'],
    outputDirectory: join(
      homedir(),
      '/exfilms/outputFormat/inputDirectoryName/',
    ),
    logDirectory: './tmp/logDirectory/',
    decimalPlace: 4,
    targeted: false,
    targetFile: '/path/to/target/file.tsv',
    mzTolerance: 0.005,
    ppmTolerance: 5,
    mzRange: false,
    minMZ: 0,
    maxMZ: NaN,
    filterSpectrumData: false,
    spectrumType: ['profile', 'centroid'],
    msLevel: [1, 2],
    polarity: ['positive', 'negative'],
    excludeSpectra: false,
  };
  const testFile1 = join(testArgv.inputDirectory, 'testFile1.mzML');
  const testFile2 = join(testArgv.inputDirectory, 'testFile2.mzML');

  // Setting up test environment before tests
  beforeAll(() => {
    //Create tmp folder and input files for assess
    if (!existsSync(testArgv.inputDirectory)) {
      mkdirSync(testArgv.inputDirectory, { recursive: true });
    }
    writeFileSync(testFile1, 'Test file 1');
    writeFileSync(testFile2, 'Test file 2');
  });

  // Tests
  test('configuration with default values', async () => {
    const configParam = await setDefaults(testArgv);

    expect(configParam.inputDirectory).toStrictEqual(testArgv.inputDirectory);
    expect(configParam.fileList).toStrictEqual([
      'testFile1.mzML',
      'testFile2.mzML',
    ]);
    expect(configParam.outputFormat).toStrictEqual(testArgv.outputFormat[0]);
    expect(configParam.outputDirectory).toStrictEqual(
      join(
        homedir(),
        `/exfilms/${testArgv.outputFormat[0]}/${basename(
          testArgv.inputDirectory,
        )}/`,
      ),
    );
    expect(configParam.logDirectory).toStrictEqual(testArgv.logDirectory);
    expect(configParam.decimalPlace).toStrictEqual(testArgv.decimalPlace);
    expect(configParam.targeted).toStrictEqual(testArgv.targeted);
    expect(configParam.mzRange).toStrictEqual(testArgv.mzRange);
    expect(configParam.filterSpectrumData).toStrictEqual(
      testArgv.filterSpectrumData,
    );
  });

  test('configuration with defined values', async () => {
    testArgv.fileList = ['testFile1.mzML'];
    testArgv.outputDirectory = './tmp/outputDirectory';
    testArgv.targeted = true;
    testArgv.mzRange = true;
    testArgv.filterSpectrumData = true;
    const configParam = await setDefaults(testArgv);

    expect(configParam.fileList).toStrictEqual(testArgv.fileList);
    expect(configParam.outputDirectory).toStrictEqual(testArgv.outputDirectory);
    expect(configParam.targetFile).toStrictEqual(testArgv.targetFile);
    expect(configParam.mzTolerance).toStrictEqual(testArgv.mzTolerance);
    expect(configParam.ppmTolerance).toStrictEqual(testArgv.ppmTolerance);
    expect(configParam.minMZ).toStrictEqual(testArgv.minMZ);
    expect(configParam.maxMZ).toStrictEqual(testArgv.maxMZ);
    expect(configParam.spectrumType).toStrictEqual(testArgv.spectrumType);
    expect(configParam.msLevel).toStrictEqual(testArgv.msLevel);
    expect(configParam.polarity).toStrictEqual(testArgv.polarity);
    expect(configParam.excludeSpectra).toStrictEqual(testArgv.excludeSpectra);
  });

  // Clean up test environment after tests
  afterAll(() => {
    // Remove all tmp folder and files created
    rmSync(testArgv.inputDirectory, { recursive: true });
  });
});
