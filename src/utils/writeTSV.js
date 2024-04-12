/**
 * @typedef {import('../typedef/index.mjs').MS} MS
 */

import { writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';

/**
 * Write extracted (and filtered) MS data into TSV file in output directories (spectrum and chromatogram).
 * @param {string} outputDirectory Output directory path.
 * @param {MS} data Extracted MS data.
 * @returns {Promise<void>} A promise that resolves when the extracted MS data is successfully written into TSV files (spectrum and chromatogram).
 * @throws {Error} Throws error if writeTSV() encounters issues in its process.
 */
export async function writeTSV(outputDirectory, data) {
  // Check input type
  if (typeof outputDirectory !== 'string') {
    throw new Error('writeTSV(): outputDirectory must be of type string');
  }

  // Spectrum and chromatogram output path
  const spectrumFile = join(outputDirectory, `spectrum/${data.id}.tsv`);
  const chromatogramFile = join(outputDirectory, `chromatogram/${data.id}.tsv`);

  // Header for both spectrum and chromatogram data
  const spectrumHeader =
    'id\tdate\ttime\tspectrumCount\tindex\tid\tarrayLength\ttype\tmsLevel\tscanType\tpolarity\tretentionTime\tpresetScanConfiguration\tinverseReducedIonMobility\tscanWindowLowerLimit\tscanWindowUpperLimit\tisolationWindowTarget\tisolationWindowLowerOffset\tisolationWindowUpperOffset\tselectedIonMZ\tcollisionType\tcollisionEnergy\tbasePeakIntensity\tbasePeakMZ\ttotalIonCurrent\tmzArray\tintensityArray\n';
  const chromatogramHeader =
    'id\tdate\ttime\tchromatogramCount\tindex\tid\tarrayLength\ttype\tpolarity\tdwellTime\tprecursorIsolationWindowTarget\tcollisionType\tcollisionEnergy\tproductIsolationWindowTarget\ttimeArray\tintensityArray\tmsLevelArray\tmzArray\n';
  writeFileSync(spectrumFile, spectrumHeader);
  writeFileSync(chromatogramFile, chromatogramHeader);

  // Spectrum data
  if (data.spectrumCount !== 0) {
    for (let i = 0; i < data.spectrumCount; i++) {
      const spectrum = data.spectrum[i];
      appendFileSync(
        spectrumFile,
        `${data.id}\t${data.date}\t${data.time}\t${data.spectrumCount}\t${spectrum.index}\t${spectrum.id}\t${spectrum.arrayLength}\t${spectrum.type}\t${spectrum.msLevel}\t${spectrum.scanType}\t${spectrum.polarity}\t${spectrum.retentionTime}\t${spectrum.presetScanConfiguration}\t${spectrum.inverseReducedIonMobility}\t${spectrum.scanWindowLowerLimit}\t${spectrum.scanWindowUpperLimit}\t${spectrum.isolationWindowTarget}\t${spectrum.isolationWindowLowerOffset}\t${spectrum.isolationWindowUpperOffset}\t${spectrum.selectedIonMZ}\t${spectrum.collisionType}\t${spectrum.collisionEnergy}\t${spectrum.basePeakIntensity}\t${spectrum.basePeakMZ}\t${spectrum.totalIonCurrent}\t${spectrum.mzArray}\t${spectrum.intensityArray}\n`,
      );
    }
  } else {
    appendFileSync(
      spectrumFile,
      `${data.id}\t${data.date}\t${data.time}\t${data.spectrumCount}\n`,
    );
  }

  // Chromatogram data
  if (data.chromatogramCount !== 0) {
    for (let i = 0; i < data.chromatogramCount; i++) {
      const chromatogram = data.chromatogram[i];
      appendFileSync(
        chromatogramFile,
        `${data.id}\t${data.date}\t${data.time}\t${data.chromatogramCount}\t${chromatogram.index}\t${chromatogram.id}\t${chromatogram.arrayLength}\t${chromatogram.type}\t${chromatogram.polarity}\t${chromatogram.dwellTime}\t${chromatogram.precursorIsolationWindowTarget}\t${chromatogram.collisionType}\t${chromatogram.collisionEnergy}\t${chromatogram.productIsolationWindowTarget}\t${chromatogram.timeArray}\t${chromatogram.intensityArray}\t${chromatogram.msLevelArray}\t${chromatogram.mzArray}\n`,
      );
    }
  } else {
    appendFileSync(
      chromatogramFile,
      `${data.id}\t${data.date}\t${data.time}\t${data.chromatogramCount}\n`,
    );
  }
}
