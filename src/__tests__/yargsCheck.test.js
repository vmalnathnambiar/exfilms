/**
 * @typedef {import('../../typedef.mjs').Yargs} Yargs
 */

import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

import { describe, test, expect, beforeAll, afterAll } from 'vitest';

import { yargsCheck } from '../yargsCheck.js';

/**
 * To test yargsCheck function
 * Input: argv (Yargs)
 * Output: configParam (Object)
 */
describe('yargsCheck', () => {
  // Dummy data
  /**
   * @type {Yargs}
   */
  const testArgv = {
    interactive: false,
    inputDirectory: undefined,
    fileList: ['*'],
    outputFormat: ['JSON'],
    outputDirectory: join(
      homedir(),
      '/exfilms/outputFormat/inputDirectoryName/',
    ),
    logDirectory: './tmp/yargsCheck/logDirectory/',
    decimalPlace: NaN,
    targeted: false,
    targetFile: undefined,
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

  const testDirectory = './tmp/yargsCheck/inputDirectory/';
  const testFile1 = join(testDirectory, 'testFile1.mzML');
  const testFile2 = join(testDirectory, 'testFile2.json');

  // Setting up test environment before tests
  beforeAll(() => {
    if (!existsSync(testDirectory)) {
      mkdirSync(testDirectory, { recursive: true });
    }
    writeFileSync(testFile1, 'Test file 1');
    writeFileSync(testFile2, 'Test file 2');
  });

  // Tests
  test('throw error: inputDirectory not defined', async () => {
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-i (or --inputDirectory) "/path/to/input/directory/" required',
    );
  });

  test('throw error: both targeted and mzRange defined', async () => {
    testArgv.inputDirectory = testDirectory;
    testArgv.targeted = true;
    testArgv.mzRange = true;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\nUse one of the following options for spectra filtering:\n-t (or --targeted) --targetFile "/local/path/or/published/to/web/URL/to/target/tsv/file" --mzTolerance <number> --ppmTolerance <number>\n-r (or --mzRange) --minMZ <number> --maxMZ <number',
    );
    testArgv.mzRange = false;
  });

  test('throw error: targetFile not defined when targeted is defined', async () => {
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n--targetFile "/path/to/target/file.tsv" required',
    );
  });

  test('throw error: targetFile, mzTolerance and ppmTolerance defined (not default values) without targeted ', async () => {
    testArgv.targeted = false;
    testArgv.targetFile = './tmp/targetFile.tsv';
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-t (or --targeted) required to specify --targetFile, --mzTolerance and --ppmTolerance',
    );
    testArgv.targetFile = undefined;

    testArgv.mzTolerance = 3;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-t (or --targeted) required to specify --targetFile, --mzTolerance and --ppmTolerance',
    );
    testArgv.mzTolerance = 0.005;

    testArgv.ppmTolerance = 3;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-t (or --targeted) required to specify --targetFile, --mzTolerance and --ppmTolerance',
    );
    testArgv.ppmTolerance = 5;
  });

  test('throw error: minMZ and maxMZ defined (not default values) without mzRange', async () => {
    testArgv.minMZ = 500;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '-r (or --mzRange) required to specify --minMZ and --maxMZ',
    );
    testArgv.minMZ = 0;

    testArgv.maxMZ = 500;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '-r (or --mzRange) required to specify --minMZ and --maxMZ',
    );
    testArgv.maxMZ = NaN;
  });

  test('throw error: maxMZ defined (not default value) is smaller than minMZ', async () => {
    testArgv.mzRange = true;
    testArgv.minMZ = 500;
    testArgv.maxMZ = 10;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\nmaxMZ value needs to be greater than minMZ value',
    );
    testArgv.mzRange = false;
    testArgv.minMZ = 0;
    testArgv.maxMZ = NaN;
  });

  test('throw error: spectrumType, msLevel, polarity and excludeSpectra defined (not default values) without filterSpectrumData', async () => {
    testArgv.spectrumType = ['profile'];
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-s (or --filterSpectrumData) required to specify --spectrumType, --msLevel, --polarity and --excludeSpectra',
    );
    testArgv.spectrumType = ['profile', 'centroid'];

    testArgv.msLevel = [1];
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-s (or --filterSpectrumData) required to specify --spectrumType, --msLevel, --polarity and --excludeSpectra',
    );

    testArgv.msLevel = [1, 3];
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-s (or --filterSpectrumData) required to specify --spectrumType, --msLevel, --polarity and --excludeSpectra',
    );
    testArgv.msLevel = [1, 2];

    testArgv.polarity = ['positive'];
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-s (or --filterSpectrumData) required to specify --spectrumType, --msLevel, --polarity and --excludeSpectra',
    );
    testArgv.polarity = ['positive', 'negative'];

    testArgv.excludeSpectra = true;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-s (or --filterSpectrumData) required to specify --spectrumType, --msLevel, --polarity and --excludeSpectra',
    );
    testArgv.excludeSpectra = false;
  });

  test('return configParam: using default values', async () => {
    const configParam = await yargsCheck(testArgv);

    expect(configParam).toHaveProperty('inputDirectory');
    expect(configParam).toHaveProperty('fileList');
    expect(configParam).toHaveProperty('outputFormat');
    expect(configParam).toHaveProperty('outputDirectory');
    expect(configParam).toHaveProperty('logDirectory');
    expect(configParam).toHaveProperty('decimalPlace');
    expect(configParam).toHaveProperty('targeted');
    expect(configParam).not.toHaveProperty('targetFile');
    expect(configParam).not.toHaveProperty('mzTolerance');
    expect(configParam).not.toHaveProperty('ppmTolerance');
    expect(configParam).toHaveProperty('mzRange');
    expect(configParam).not.toHaveProperty('minMZ');
    expect(configParam).not.toHaveProperty('maxMZ');
    expect(configParam).toHaveProperty('filterSpectrumData');
    expect(configParam).not.toHaveProperty('spectrumType');
    expect(configParam).not.toHaveProperty('msLevel');
    expect(configParam).not.toHaveProperty('polarity');
    expect(configParam).not.toHaveProperty('excludeSpectra');
  });

  test('return configParam: using defined values', async () => {
    testArgv.fileList = ['testFile1.mzML'];
    testArgv.outputDirectory = './tmp/yargsCheck/outputDirectory/';
    testArgv.filterSpectrumData = true;

    // If mzRange is set to true
    testArgv.mzRange = true;
    let configParam = await yargsCheck(testArgv);

    expect(configParam).not.toHaveProperty('targetFile');
    expect(configParam).not.toHaveProperty('mzTolerance');
    expect(configParam).not.toHaveProperty('ppmTolerance');
    expect(configParam).toHaveProperty('minMZ');
    expect(configParam).toHaveProperty('maxMZ');
    expect(configParam).toHaveProperty('spectrumType');
    expect(configParam).toHaveProperty('msLevel');
    expect(configParam).toHaveProperty('polarity');
    expect(configParam).toHaveProperty('excludeSpectra');
    testArgv.mzRange = false;

    // If targeted is set to true
    testArgv.targeted = true;
    testArgv.targetFile = './tmp/yargsCheck/targetFile.tsv';
    configParam = await yargsCheck(testArgv);

    expect(configParam).toHaveProperty('targetFile');
    expect(configParam).toHaveProperty('mzTolerance');
    expect(configParam).toHaveProperty('ppmTolerance');
    expect(configParam).not.toHaveProperty('minMZ');
    expect(configParam).not.toHaveProperty('maxMZ');
    expect(configParam).toHaveProperty('spectrumType');
    expect(configParam).toHaveProperty('msLevel');
    expect(configParam).toHaveProperty('polarity');
    expect(configParam).toHaveProperty('excludeSpectra');
  });

  // Clean up test environment after tests
  afterAll(() => {
    rmSync('./tmp/yargsCheck/', { recursive: true });
  });
});
