// @ts-nocheck

import { describe, test, expect } from 'vitest';

import { roundDecimalPlace } from '../roundDecimalPlace.js';

/**
 * To test roundDecimalPlace(toRoundValue, decimalPlace) function
 *    Input: toRoundValue (number), decimalPlace (number)
 *    Output: Promise<number> (Rounded value)
 */
describe('roundDecimalPlace', () => {
  // Dummy data
  const toRoundValue = 1518.712539;
  const decimalPlace = 4;
  const roundedValue = 1518.7125;

  // Test if the function throws an error if toRoundValue is not a number
  test('throws error if toRoundValue is not a number', async () => {
    await expect(
      roundDecimalPlace(`${toRoundValue}`, decimalPlace),
    ).rejects.toThrowError('\ntoRoundValue must be a number');
  });

  // Test if the function throws an error if decimalPlace is not a number
  test('throws error if decimalPlace is not a number', async () => {
    await expect(
      roundDecimalPlace(toRoundValue, `${decimalPlace}`),
    ).rejects.toThrowError('\ndecimalPlace must be a number');
  });

  // Test if the function returns a number that has been rounded to a specific decimal place
  test('return a number rounded a specific decimal place', async () => {
    expect(await roundDecimalPlace(toRoundValue, decimalPlace))
      .toBeTypeOf('number')
      .toBe(roundedValue);
  });
});
