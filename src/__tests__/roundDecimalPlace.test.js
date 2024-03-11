// @ts-nocheck

import { describe, test, expect } from 'vitest';

import { roundDecimalPlace } from '../roundDecimalPlace.js';

/**
 * To test roundDecimalPlace function
 * Input: toRoundValue (number), decimalPlace (number)
 * Output: Rounded value to a specified number of decimal places (number)
 */
describe('roundDecimalPlace', () => {
  // Dummy data
  const testToRoundValue = 1518.712539;
  const testDecimalPlace = 4;

  // Tests
  test('throw error: toRoundValue is not of type number', async () => {
    await expect(
      roundDecimalPlace(testToRoundValue.toString(), testDecimalPlace),
    ).rejects.toThrowError(
      '\nroundDecimalPlace() - toRoundValue must be of type number',
    );
  });

  test('throw error: decimalPlace is not of type number', async () => {
    // isString
    await expect(
      roundDecimalPlace(testToRoundValue, testDecimalPlace.toString()),
    ).rejects.toThrowError(
      '\nroundDecimalPlace() - decimalPlace must be of type number',
    );

    // isNaN
    await expect(roundDecimalPlace(testToRoundValue, NaN)).rejects.toThrowError(
      '\nroundDecimalPlace() - decimalPlace must be of type number',
    );
  });

  test('return rounded value', async () => {
    expect(
      await roundDecimalPlace(testToRoundValue, testDecimalPlace),
    ).toStrictEqual(1518.7125);
  });
});
