// @ts-nocheck

import { describe, test, expect } from 'vitest';

import { roundDecimalPlace } from '../roundDecimalPlace.js';

describe('round decimal place', () => {
  test('round values appropriately', async () => {
    expect(await roundDecimalPlace(1518.712539, 4)).toBe(1518.7125);
  });

  test('throw error if other than number types are passed for toRoundValue', async () => {
    expect(
      async () => await roundDecimalPlace('1518.712539', 4),
    ).rejects.toThrowError(
      `\nInvalid argument: toRoundValue must be type Number`,
    );
  });

  test('throw error if other than number types are passed for decimalPlace', async () => {
    expect(
      async () => await roundDecimalPlace(1518.712539, '5'),
    ).rejects.toThrowError(
      `\nInvalid argument: decimalPlace must be type Number`,
    );
  });
});
