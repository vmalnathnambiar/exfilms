// @ts-nocheck

import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';

import { describe, test, expect, beforeAll, afterAll } from 'vitest';

import { writeLog } from '../writeLog.js';

/**
 * To test writeLog function
 * Input: configParam (Object), data (string)
 * Output: NA || Error message (Error)
 */
describe('writeLog', () => {
  // Dummy data
  const testLogDirectory = './.tmp/writeLog/logDirectory/';
  const testData = 'Test log message';

  // Setting up test environment before tests
  beforeAll(() => {
    if (!existsSync(testLogDirectory)) {
      mkdirSync(testLogDirectory, { recursive: true });
    }
  });

  test('throw error: input type check', async () => {
    // logDirectory
    await expect(writeLog(0, testData)).rejects.toThrowError(
      '\nwriteLog() - logDirectory must be of type string',
    );

    // data
    await expect(writeLog(testLogDirectory, 0)).rejects.toThrowError(
      '\nwriteLog() - data must be of type string',
    );
  });

  test('write log data into log.txt', async () => {
    expect(await writeLog(testLogDirectory, testData));
    const readData = readFileSync(join(testLogDirectory, 'log.txt'), 'utf-8');
    expect(readData).toStrictEqual(testData);
  });

  // Clean up test environment after tests
  afterAll(() => {
    rmSync('./.tmp/writeLog/', { recursive: true });
  });
});
