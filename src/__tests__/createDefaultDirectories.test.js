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
  const testConfigFormat = {
    outputFormat: 'TSV',
    outputDirectory: './.tmp/createDefaultDirectories/outputDirectory/',
    logDirectory: './.tmp/createDefaultDirectories/logDirectory/',
  };

  // Clean up tmp environment after each tests
  afterEach(() => {
    rmSync('./.tmp/createDefaultDirectories/', { recursive: true });
  });

  // Tests
  test('create default directories: TSV format', async () => {
    expect(await createDefaultDirectories(testConfigFormat));
    expect(
      existsSync(join(testConfigFormat.outputDirectory, 'spectrum/')),
    ).toBe(true);
    expect(
      existsSync(join(testConfigFormat.outputDirectory, 'chromatogram/')),
    ).toBe(true);
    expect(existsSync(testConfigFormat.logDirectory)).toBe(true);
  });

  test('create default directories: JSON format', async () => {
    testConfigFormat.outputFormat = 'JSON';
    expect(await createDefaultDirectories(testConfigFormat));
    expect(existsSync(testConfigFormat.outputDirectory)).toBe(true);
    expect(existsSync(testConfigFormat.logDirectory)).toBe(true);
  });
});
