// @ts-nocheck

import { describe, test, expect } from 'vitest';

import { setForSpectraFiltering } from '../utils/setForSpectraFiltering.js';

/**
 * To test setForSpectraFiltering()
 * Input: configParam (Object)
 * Output: Updated configuration parameters required for spectra filtering (Object) || Error message (Error)
 */
describe('setForSpectraFiltering', () => {
  // Dummy data
  const testConfigParam = {
    decimalPlace: NaN,
    targeted: false,
    targetFile: undefined,
    mzTolerance: undefined,
    ppmTolerance: undefined,
    mzRange: false,
    minMZ: undefined,
    maxMZ: undefined,
    mzTargetList: undefined,
    filterSpectrum: false,
    msLevel: undefined,
  };

  // Tests
  test('return configParam: using default values', async () => {
    const configParam = await setForSpectraFiltering(testConfigParam);
    expect(configParam.mzTargetList).toBeUndefined();
    expect(configParam.minMZ).toBeUndefined();
    expect(configParam.maxMZ).toBeUndefined();
  });

  test('return configParam: mzRange defined', async () => {
    testConfigParam.mzRange = true;
    testConfigParam.decimalPlace = 4;
    testConfigParam.minMZ = 90.76644;
    testConfigParam.maxMZ = 1518.712539;
    const configParam = await setForSpectraFiltering(testConfigParam);
    expect(configParam.mzTargetList).toBeUndefined();
    expect(configParam.minMZ).toStrictEqual(90.7664);
    expect(configParam.maxMZ).toStrictEqual(1518.7125);
  });

  test('return configParam: targeted defined', async () => {
    testConfigParam.mzRange = false;
    testConfigParam.minMZ = undefined;
    testConfigParam.maxMZ = undefined;

    // TSV pattern check failure
    testConfigParam.targeted = true;
    testConfigParam.mzTolerance = 0.005;
    testConfigParam.ppmTolerance = 5;
    testConfigParam.targetFile = '';
    await expect(setForSpectraFiltering(testConfigParam)).rejects.toThrowError(
      'parseTargetFile(): targetFile does not match TSV pattern check',
    );

    // Published to web URL pattern
    testConfigParam.targetFile =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vSeo31hlruA3QuwoESz5IDJ9Nu6ndSAgLTRn3uc45rOPO4BlksfHzh9xtNB22Oes9JOxhEbI4NK-zxl/pub?gid=0&single=true&output=tsv';
    let configParam = await setForSpectraFiltering(testConfigParam);
    expect(configParam).toHaveProperty('mzTargetList');
    expect(configParam.minMZ).toBeDefined();
    expect(configParam.maxMZ).toBeDefined();

    // Local file TSV pattern
    testConfigParam.targetFile = './data/targetFile/validLayout.tsv';
    configParam = await setForSpectraFiltering(testConfigParam);
    expect(configParam).toHaveProperty('mzTargetList');
    expect(configParam.minMZ).toBeDefined();
    expect(configParam.maxMZ).toBeDefined();

    // Filter spectrum of a specific MS level that do not have target m/z data
    testConfigParam.filterSpectrum = true;
    testConfigParam.msLevel = [3];
    await expect(setForSpectraFiltering(testConfigParam)).rejects.toThrowError(
      'parseTargetFile(): Target m/z data not found',
    );

    // Filter spectrum and decimalPlace is not NaN
    testConfigParam.msLevel = [1];
    configParam = await setForSpectraFiltering(testConfigParam);
    expect(configParam).toHaveProperty('mzTargetList');
    expect(configParam.minMZ).toBeDefined();
    expect(configParam.maxMZ).toBeDefined();

    // Filter spectrum and decimalPlace is NaN
    testConfigParam.decimalPlace = NaN;
    configParam = await setForSpectraFiltering(testConfigParam);
    expect(configParam).toHaveProperty('mzTargetList');
    expect(configParam.minMZ).toBeDefined();
    expect(configParam.maxMZ).toBeDefined();

    // Invalid target file layout (wrong headers)
    testConfigParam.targetFile = './data/targetFile/invalidLayout.tsv';
    await expect(setForSpectraFiltering(testConfigParam)).rejects.toThrowError(
      'parseTargetFile(): Missing column headers - compoundName, compoundType, mzValue, retentionTime, msLevel, internalStandard',
    );

    // Empty file with headers
    testConfigParam.targetFile = './data/targetFile/empty.tsv';
    await expect(setForSpectraFiltering(testConfigParam)).rejects.toThrowError(
      'parseTargetFile(): Target m/z data not found',
    );
  });

  // ! Fail to catch roundDecimal() input type error - Code won't reach: roundDecimalPlace.js line 11, 13-14
  // decimalPlace is always coerced into number type resulting in NaN if not a number
  // toRoundValue is always coerced into number type resulting in NaN if not a number
  // roundDecimal() unit test is conducted and covers all lines
});
