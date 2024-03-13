import { existsSync, rmSync } from 'fs';
import { join } from 'path';

import { describe, test, expect, afterEach } from 'vitest';

import { createDefaultDirectories } from '../createDefaultDirectories.js';

/**
 * To test createDefaultDirectories function
 * Input: configParam (Object)
 * Output: NA
 */
describe('createDefaultDirectories', () => {
  // Dummy data
  const testConfigParam = {
    outputFormat: 'TSV',
    outputDirectory: './tmp/createDefaultDirectories/outputDirectory/',
    logDirectory: './tmp/createDefaultDirectories/logDirectory/',
  };

  // Clean up tmp environment after each tests
  afterEach(() => {
    rmSync('./tmp/createDefaultDirectories/', { recursive: true });
  });

  // Tests
  test('create directories: TSV format', async () => {
    expect(await createDefaultDirectories(testConfigParam));
    expect(existsSync(join(testConfigParam.outputDirectory, 'spectrum/'))).toBe(
      true,
    );
    expect(
      existsSync(join(testConfigParam.outputDirectory, 'chromatogram/')),
    ).toBe(true);
    expect(existsSync(testConfigParam.logDirectory)).toBe(true);
  });

  test('create directories: JSON format', async () => {
    testConfigParam.outputFormat = 'JSON';
    expect(await createDefaultDirectories(testConfigParam));
    expect(existsSync(testConfigParam.outputDirectory)).toBe(true);
    expect(existsSync(testConfigParam.logDirectory)).toBe(true);
  });
});
