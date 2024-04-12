import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Create default directories (output and log) for ExfilMS operation.
 * @param {Object} configParam Configuration parameters.
 * @returns {Promise<void>} A promise that resolves when all default directories have been created (if non-existent).
 */
export async function createDefaultDirectories(configParam) {
  // Create output directory/directories
  if (configParam.outputFormat === 'TSV') {
    // If output format is TSV
    const spectrumDirectory = join(configParam.outputDirectory, 'spectrum/');
    const chromatogramDirectory = join(
      configParam.outputDirectory,
      'chromatogram/',
    );

    if (!existsSync(spectrumDirectory)) {
      mkdirSync(spectrumDirectory, {
        recursive: true,
      });
    }

    if (!existsSync(chromatogramDirectory)) {
      mkdirSync(chromatogramDirectory, {
        recursive: true,
      });
    }
  } else if (!existsSync(configParam.outputDirectory)) {
    // If output format is anything other than TSV
    mkdirSync(configParam.outputDirectory, { recursive: true });
  }

  // Create log directory
  if (!existsSync(configParam.logDirectory)) {
    mkdirSync(configParam.logDirectory, { recursive: true });
  }
}
