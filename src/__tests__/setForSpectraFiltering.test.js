// @ts-nocheck

import { describe, test, expect } from 'vitest';

import { setForSpectraFiltering } from '../utils/setForSpectraFiltering.js';

/**
 * To test setForSpectraFiltering()
 * Input: configParam (Object)
 * Output: An updated object of configParam (if spectra filtering is defined) (Object) || Error message (Error)
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
    filterSpectrumData: false,
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
    testConfigParam.decimalPlace = NaN;
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

    // Filter spectrum data
    testConfigParam.filterSpectrumData = true;
    testConfigParam.msLevel = [1];
    testConfigParam.targetFile = './data/targetFile/invalidLayout.tsv';
    await expect(setForSpectraFiltering(testConfigParam)).rejects.toThrowError(
      'parseTargetFile(): Target m/z data not found',
    );

    // Same as above but without filter spectrum data
    testConfigParam.filterSpectrumData = false;
    await expect(setForSpectraFiltering(testConfigParam)).rejects.toThrowError(
      'parseTargetFile(): Target m/z data not found',
    );

    // decimalPlace is not NaN
    testConfigParam.decimalPlace = 4;
    testConfigParam.targetFile = './data/targetFile/validLayout.tsv';
    configParam = await setForSpectraFiltering(testConfigParam);
    expect(configParam).toHaveProperty('mzTargetList');
    expect(configParam.minMZ).toBeDefined();
    expect(configParam.maxMZ).toBeDefined();
  });

  // ! Fail to catch roundDecimal() error - Code won't reach: roundDecimalPlace.js line 11-13, 15-18
  // ! decimalPlace is always coerced into number resulting in NaN if not a number and skip roundDecimal()
  // ! toRoundValue is also coerced into number type resulting in NaN if not a number
  // test('throw error: roundDecimalPlace() input type check', async () => {
  //   testConfigParam.decimalPlace = testConfigParam.decimalPlace.toString();
  //   await expect(setForSpectraFiltering(testConfigParam)).rejects.toThrowError(
  //     'roundDecimalPlace(): decimalPlace must be of type number',
  //   );

  //   testConfigParam.mzTolerance = '5a';
  //   await expect(setForSpectraFiltering(testConfigParam)).rejects.toThrowError(
  //     'roundDecimalPlace(): toRoundValue must be of type number',
  //   );
  // });
});
