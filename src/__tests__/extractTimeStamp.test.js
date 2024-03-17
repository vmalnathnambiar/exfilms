// @ts-nocheck

import { describe, test, expect } from 'vitest';

import { extractTimeStamp } from '../utils/extractTimeStamp.js';

/**
 * To test extractTimeStamp function
 * Input: timeStamp (string)
 * Output: An object with extracted date and time (TimeStamp) || Error message (Error)
 */
describe('extractTimeStamp', () => {
  // Tests
  test('throw error: input type check', async () => {
    await expect(extractTimeStamp(0)).rejects.toThrowError(
      '\nextractTimeStamp() - timeStamp must be of type string',
    );
  });

  test('return TimeStamp object: valid timestamp pattern', async () => {
    const timeStamp = await extractTimeStamp('2023-02-28T15:15:10Z');
    expect(timeStamp.date).toStrictEqual('2023-02-28');
    expect(timeStamp.time).toStrictEqual('15:15:10');
  });

  test('return TimeStamp object: invalid timestamp pattern', async () => {
    const timeStamp = await extractTimeStamp('28-02-2023T1555:10Z');
    expect(timeStamp.date).toBeNull();
    expect(timeStamp.time).toBeNull();
  });
});
