import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

import { describe, test, expect, beforeAll, afterAll } from 'vitest';

import { listMZML } from '../listMZML.js';

/**
 * To test listMZML function
 * Input: directory path (string)
 * Output: An array list of file names (String[])
 */
describe('listMZML Check', () => {
  // Dummy data
  const testDirectory = join(homedir(), '/tmp/testDirectory/');
  const file1 = join(testDirectory, 'file1.mzML');
  const file2 = join(testDirectory, 'file3.json');
  const file3 = join(testDirectory, '._file1.mzML');

  // Setting up test environment before tests
  beforeAll(() => {
    //Create tmp folder and input files for assess
    if (!existsSync(testDirectory)) {
      mkdirSync(testDirectory, { recursive: true });
    }
    writeFileSync(file1, 'Test file 1');
    writeFileSync(file2, 'Test file 2');
    writeFileSync(file3, 'Test file 3');
  });

  // Tests
  test('return list of mzML files only', async () => {
    expect(await listMZML(testDirectory)).toStrictEqual(['file1.mzML']);
  });

  // Clean up test environment after tests
  afterAll(() => {
    // Remove all tmp folder and files created
    rmSync(join(homedir(), '/tmp/'), { recursive: true });
  });
});
