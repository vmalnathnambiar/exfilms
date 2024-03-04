import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { configParam } from '../bin/exfilms.js';

/**
 * Create default directories: output and log; for ExfilMS operation.
 * @returns {Promise<void>} A promise that resolves when both directories have been created (if they don't already exist).
 */
export async function createDefaultDirectories() {
  // Create output directory/directories
  if (!existsSync(configParam.outputDirectory)) {
    mkdirSync(configParam.outputDirectory, { recursive: true });

    // If output format is TSV
    if (configParam.outputFormat === 'TSV') {
      mkdirSync(join(configParam.outputDirectory, 'spectrum/'), {
        recursive: true,
      });
      mkdirSync(join(configParam.outputDirectory, 'chromatogram/'), {
        recursive: true,
      });
    }
  }

  // Create log directory
  if (!existsSync(configParam.logDirectory)) {
    mkdirSync(configParam.logDirectory, { recursive: true });
  }
}
