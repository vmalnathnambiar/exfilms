/* eslint-disable no-empty-function */
// @ts-nocheck

import { readFile, rm, mkdir } from 'fs/promises';
import { join } from 'path';

import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from 'vitest';

import { writeLog } from '../writeLog.js';

/**
 * To test writeLog(configParam, data) function
 *    Input: configParam (Object) - logDirectory (string), data (string)
 *    Output: Promise<void> (true or false)
 */
describe('writeLog', () => {
  // Dummy data
  const logDirectory = './tmp/';
  const logFile = join(logDirectory, 'log.txt');
  const configParam = { logDirectory };
  const testData = 'Test log message';

  // Setting up test environment behavior
  beforeAll(async () => {
    await mkdir(logDirectory, { recursive: true }).catch(() => {});
  });

  beforeEach(async () => {
    // Clean log file before each test
    await rm(logFile).catch(() => {});
  });

  afterAll(async () => {
    // Clean log directory after all test is complete
    await rm(logDirectory, { recursive: true, force: true }).catch(() => {});
  });

  // Test if the function throws an error if logDirectory is not a string
  test('throws an error if log directory path is not a string', async () => {
    await expect(
      writeLog({ logDirectory: 123 }, testData),
    ).rejects.toThrowError('\nlog directory path must be a string');
  });

  // Test if the function throws an error if data is not a string
  test('throws an error if data is not a string', async () => {
    await expect(writeLog(configParam, 123)).rejects.toThrowError(
      '\ndata must be a string',
    );
  });

  // Test if the function writes log data to log file correctly
  test('writes log data to a file', async () => {
    await writeLog(configParam, testData);

    const fileContent = await readFile(logFile, 'utf-8');
    expect(fileContent).toBe(testData);
  });
});
