// @ts-nocheck

import { describe, test, expect } from 'vitest';

import { extractTimestamp } from '../utils/extractDateTime.js';

/**
 * To test extractTimestamp()
 * Input: timestamp (string)
 * Output: An object with extracted date and time (Timestamp) || Error message (Error)
 */
describe('extractTimestamp', () => {
  // Tests
  test('throw error: input type check', async () => {
    await expect(extractTimestamp(0)).rejects.toThrowError(
      'extractTimestamp(): timestamp must be of type string',
    );
  });

  test('return Timestamp object: valid timestamp pattern', async () => {
    const timestamp = await extractTimestamp('2023-02-28T15:15:10Z');
    expect(timestamp.date).toStrictEqual('2023-02-28');
    expect(timestamp.time).toStrictEqual('15:15:10');
  });

  test('return Timestamp object: invalid timestamp pattern', async () => {
    const timestamp = await extractTimestamp('28-02-2023T1555:10Z');
    expect(timestamp.date).toBeNull();
    expect(timestamp.time).toBeNull();
  });
});
