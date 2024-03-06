// @ts-nocheck

import { appendFile } from 'fs/promises';
import { join } from 'path';

import { describe, test, expect, vi } from 'vitest';

import { writeLog } from '../writeLog.js';

/**
 * To test writeLog(configParam, data) function
 *    Input: configParam (Object), data (string)
 *        ? Test for configParam (dynamic properties)
 *
 *    Output: Promise<void> (true or false)
 */
describe('writeLog', () => {
  // Initialise dummy data
  const configParam = {
    logDirectory: '/mock/log/directory/',
  };
  const data = 'This is a log message to be written into the log file.';

  // Mock import modules
  vi.mock('fs/promises');
  vi.mock('path');

  // Test for input parameter type error
  test('throw error if data is not of type "string"', async () => {
    expect(writeLog(configParam, 1)).rejects.toThrowError(
      '\nInvalid argument: data must be of type "string"',
    );
  });

  // Test for writing to file
  test('successfully write log data to file', async () => {
    join.mockResolvedValue(true);
    appendFile.mockResolvedValue(true);

    await expect(writeLog(configParam, data)).resolves.toBe(true);
  });

  test('failure to write log data to file', async () => {
    join.mockResolvedValue(true);
    appendFile.mockResolvedValue(false);

    await expect(writeLog(configParam, data)).resolves.toBe(false);
  });
});
