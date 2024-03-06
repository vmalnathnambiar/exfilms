// @ts-nocheck

import { describe, test, expect } from 'vitest';

import { roundDecimalPlace } from '../roundDecimalPlace.js';

/**
 * To test roundDecimalPlace(toRoundValue, decimalPlace) function
 *    Input: toRoundValue (number), decimalPlace (number)
 *    Output: Promise<number> (Rounded value)
 */
describe('roundDecimalPlace', () => {
  //Initialise dummy data
  const toRoundValue = 1518.712539;
  const decimalPlace = 4;
  const roundedValue = 1518.7125;

  // Test for input parameter type error
  test('throw error if toRoundValue is not of type "number"', async () => {
    expect(
      roundDecimalPlace(`${toRoundValue}`, decimalPlace),
    ).rejects.toThrowError(
      '\nInvalid argument: toRoundValue must be of type "number"',
    );
  });

  test('throw error if decimalPlace is not of type "number"', async () => {
    expect(
      roundDecimalPlace(toRoundValue, `${decimalPlace}`),
    ).rejects.toThrowError(
      '\nInvalid argument: decimalPlace must be of type "number"',
    );
  });

  // Test for rounding of toRoundValue to a specific decimal place
  test('Round value to a specific decimal place', async () => {
    expect(await roundDecimalPlace(toRoundValue, decimalPlace)).toBe(
      roundedValue,
    );
  });
});
