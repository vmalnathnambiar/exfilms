// @ts-nocheck

/**
 * @typedef {import('../../typedef.mjs').Yargs} Yargs
 */

import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

import { describe, test, expect, beforeAll, afterAll } from 'vitest';

import { setDefaults } from '../setDefaults.js';
import { yargsCheck } from '../yargsCheck.js';

/**
 * To test yargsCheck function
 * Input: argv (Yargs)
 * Output:
 */
describe('yargs Check', () => {
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
    logDirectory: '/tmp/logDirectory/',
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

  const testDirectory = join(homedir(), '/tmp/inputDirectory/');
  const file1 = join(testDirectory, 'file1.mzML');
  const file2 = join(testDirectory, 'file2.json');

  // Setting up test environment before tests
  beforeAll(() => {
    //Create tmp folder and input files for assess
    if (!existsSync(testDirectory)) {
      mkdirSync(testDirectory, { recursive: true });
    }
    writeFileSync(file1, 'Test file 1');
    writeFileSync(file2, 'Test file 2');
  });

  // Tests
  test('throw an error if -i, --inputDirectory is not defined', async () => {
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-i (or --inputDirectory) "/path/to/input/directory/" required',
    );
  });

  test('throw an error if both -t, --targeted and -r, --mzRange are defined (not default values)', async () => {
    testArgv.inputDirectory = testDirectory;
    testArgv.targeted = true;
    testArgv.mzRange = true;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\nUse one of the following options for m/z value range filtering:\n-t (or --targeted) --targetFile "/local/path/or/published/to/web/URL/to/target/tsv/file" --mzTolerance <number> --ppmTolerance <number>\n-r (or --mzRange) --minMZ <number> --maxMZ <number',
    );
    testArgv.mzRange = false;
  });

  test('throw an error if -t, --targeted is defined but --targetFile is not defined', async () => {
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n--targetFile "/path/to/target/file.tsv" required',
    );
  });

  test('throw an error if either or all --targetFile, --mzTolerance and --ppmTolerance are defined (not default values) without -t, --targeted', async () => {
    // targetFile
    testArgv.targeted = false;
    testArgv.targetFile = '/path/to/file.tsv';
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-t (or --targeted) required to specify --targetFile, --mzTolerance and --ppmTolerance',
    );
    testArgv.targetFile = undefined;

    // mzTolerance
    testArgv.mzTolerance = 3;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-t (or --targeted) required to specify --targetFile, --mzTolerance and --ppmTolerance',
    );
    testArgv.mzTolerance = 0.005;

    // ppmTolerance
    testArgv.ppmTolerance = 3;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-t (or --targeted) required to specify --targetFile, --mzTolerance and --ppmTolerance',
    );
    testArgv.ppmTolerance = 5;
  });

  test('throw an error if either or all --minMZ and --maxMZ are defined (not default values) without -r, --mzRange', async () => {
    // minMZ
    testArgv.minMZ = 500;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '-r (or --mzRange) required to specify --minMZ and --maxMZ',
    );
    testArgv.minMZ = 0;

    // maxMZ
    testArgv.maxMZ = 500;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '-r (or --mzRange) required to specify --minMZ and --maxMZ',
    );
    testArgv.maxMZ = NaN;
  });

  test('throw an error if --maxMZ is defined is a number and is smaller than --minMZ', async () => {
    testArgv.mzRange = true;
    testArgv.minMZ = 500;
    testArgv.maxMZ = 10;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\nmaxMZ value needs to be greater than minMZ value',
    );
    testArgv.minMZ = 0;
    testArgv.maxMZ = NaN;
  });

  test('throw an error if either or all --spectrumType, --msLevel, --polarity and --excludeSpectra are defined (not default values) without -s, --filterSpectrumData', async () => {
    // spectrumType
    testArgv.spectrumType = ['profile'];
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-s (or --filterSpectrumData) required to specify --spectrumType, --msLevel, --polarity and --excludeSpectra',
    );
    testArgv.spectrumType = ['profile', 'centroid'];

    // msLevel
    testArgv.msLevel = [1];
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-s (or --filterSpectrumData) required to specify --spectrumType, --msLevel, --polarity and --excludeSpectra',
    );

    testArgv.msLevel = [1, 3];
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-s (or --filterSpectrumData) required to specify --spectrumType, --msLevel, --polarity and --excludeSpectra',
    );
    testArgv.msLevel = [1, 2];

    // polarity
    testArgv.polarity = ['positive'];
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-s (or --filterSpectrumData) required to specify --spectrumType, --msLevel, --polarity and --excludeSpectra',
    );
    testArgv.polarity = ['positive', 'negative'];

    // excludeSpectra
    testArgv.excludeSpectra = true;
    await expect(yargsCheck(testArgv)).rejects.toThrowError(
      '\n-s (or --filterSpectrumData) required to specify --spectrumType, --msLevel, --polarity and --excludeSpectra',
    );
    testArgv.excludeSpectra = false;
  });

  test('execute setDefaults with default values in argv', async () => {
    expect(await setDefaults(testArgv));
  });

  test('execute setDefaults with defined values in argv', async () => {
    testArgv.fileList = ['file1.mzML'];
    testArgv.outputDirectory = '/tmp/outputDirectory/';
    testArgv.targeted = true;
    testArgv.targetFile = '/path/to/target/file.tsv';
    testArgv.mzRange = true;
    testArgv.filterSpectrumData = true;
    expect(await setDefaults(testArgv));
    testArgv.mzRange = false;
  });

  test('return successfully', async () => {
    const configParam = await yargsCheck(testArgv);
    expect(configParam.inputDirectory).toStrictEqual(testArgv.inputDirectory);
    expect(configParam.fileList).toStrictEqual(['file1.mzML']);
    expect(configParam.outputFormat).toStrictEqual(testArgv.outputFormat[0]);
    expect(configParam.outputDirectory).toStrictEqual('/tmp/outputDirectory/');
    expect(configParam.logDirectory).toStrictEqual(testArgv.logDirectory);
    expect(configParam.decimalPlace).toStrictEqual(testArgv.decimalPlace);
    expect(configParam.targeted).toStrictEqual(testArgv.targeted);
    expect(configParam.targetFile).toStrictEqual(testArgv.targetFile);
    expect(configParam.mzTolerance).toStrictEqual(testArgv.mzTolerance);
    expect(configParam.ppmTolerance).toStrictEqual(testArgv.ppmTolerance);
    expect(configParam.mzRange).toStrictEqual(testArgv.mzRange);
    expect(configParam.filterSpectrumData).toStrictEqual(
      testArgv.filterSpectrumData,
    );
    expect(configParam.spectrumType).toStrictEqual(testArgv.spectrumType);
    expect(configParam.msLevel).toStrictEqual(testArgv.msLevel);
    expect(configParam.polarity).toStrictEqual(testArgv.polarity);
    expect(configParam.excludeSpectra).toStrictEqual(testArgv.excludeSpectra);
  });

  // Clean up test environment after tests
  afterAll(() => {
    // Remove all tmp folder and files created
    rmSync(join(homedir(), '/tmp/'), { recursive: true });
  });
});
