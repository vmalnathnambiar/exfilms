// @ts-nocheck

import { describe, test, expect } from 'vitest';

import { roundDecimalPlace } from '../utils/roundDecimalPlace.js';

/**
 * To test roundDecimalPlace()
 * Input: toRoundValue (number), decimalPlace (number)
 * Output: Rounded value to a specified number of decimal places (number) || Error message (Error)
 */
describe('roundDecimalPlace', () => {
  // Dummy data
  const testToRoundValue = 1518.712539;
  const testDecimalPlace = 4;

  // Tests
  test('throw error: input type check', async () => {
    // toRoundValue
    await expect(
      roundDecimalPlace(testToRoundValue.toString(), testDecimalPlace),
    ).rejects.toThrowError(
      'roundDecimalPlace(): toRoundValue must be of type number',
    );

    // decimalPlace
    await expect(
      roundDecimalPlace(testToRoundValue, testDecimalPlace.toString()),
    ).rejects.toThrowError(
      'roundDecimalPlace(): decimalPlace must be of type number',
    );

    await expect(roundDecimalPlace(testToRoundValue, NaN)).rejects.toThrowError(
      'roundDecimalPlace(): decimalPlace must be of type number',
    );
  });

  test('return rounded value', async () => {
    expect(
      await roundDecimalPlace(testToRoundValue, testDecimalPlace),
    ).toStrictEqual(1518.7125);
  });
});
