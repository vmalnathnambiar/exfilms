// @ts-nocheck

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

import { describe, test, expect, beforeAll, afterAll } from 'vitest';

import { listMZML } from '../utils/listMZML.js';

/**
 * To test listMZML function
 * Input: directory (string)
 * Output: An array list of mzML file names (String[]) || Error message (Error)
 */
describe('listMZML', () => {
  // Dummy data
  const testDirectory = './.tmp/listMZML/';
  const testFile1 = join(testDirectory, 'testFile1.mzML');
  const testFile2 = join(testDirectory, 'testFile2.json');
  const testFile3 = join(testDirectory, '._testFile3.mzML');

  // Setting up test environment before tests
  beforeAll(() => {
    if (!existsSync(testDirectory)) {
      mkdirSync(testDirectory, { recursive: true });
    }
    writeFileSync(testFile1, 'Test file 1');
    writeFileSync(testFile2, 'Test file 2');
    writeFileSync(testFile3, 'Test file 3');
  });

  // Tests
  test('throw error: input type check', async () => {
    await expect(listMZML(0)).rejects.toThrowError(
      '\nlistMZML() - directory must be of type string',
    );
  });

  test('return array of only mzML file names', async () => {
    expect(await listMZML(testDirectory)).toStrictEqual(['testFile1.mzML']);
  });

  // Clean up test environment after tests
  afterAll(() => {
    rmSync(testDirectory, { recursive: true });
  });
});
