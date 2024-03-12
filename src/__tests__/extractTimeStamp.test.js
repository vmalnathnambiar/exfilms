// @ts-nocheck

import { describe, test, expect } from 'vitest';

import { extractTimeStamp } from '../extractTimeStamp.js';

/**
 * To test extractTimeStamp function
 * Input: timeStamp (string)
 * Output: An object with extracted date and time (TimeStamp)
 */
describe('extractTimeStamp', () => {
  // Tests
  test('throw error: timeStamp is not of type string', async () => {
    await expect(extractTimeStamp(0)).rejects.toThrowError(
      '\nextractTimeStamp() - timeStamp must be of type string',
    );
  });

  test('return TimeStamp object', async () => {
    // Valid timestamp pattern
    let timeStamp = await extractTimeStamp('2023-02-28T15:15:10Z');
    expect(timeStamp.date).toStrictEqual('2023-02-28');
    expect(timeStamp.time).toStrictEqual('15:15:10');

    // Invalid timestamp pattern
    timeStamp = await extractTimeStamp('28-02-2023T1555:10Z');
    expect(timeStamp.date).toBeNull();
    expect(timeStamp.time).toBeNull();
  });
});
