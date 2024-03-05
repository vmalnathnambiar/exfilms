import { writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';

/**
 * Write extracted (and filtered) MS data into TSV file in output directories (spectrum and chromatogram).
 * @param {Object} configParam Configuration parameters passed via the command line interface.
 * @param {Object} data MS data extracted from parsed mzML file.
 * @returns {Promise<void>} A Promise that resolves when the writing to TSV files are complete.
 */
export async function writeTSV(configParam, data) {
  // Path to spectrum and chromatogram output path
  const spectrumFile = join(
    configParam.outputDirectory,
    `spectrum/${data.sampleID}.tsv`,
  );
  const chromatogramFile = join(
    configParam.outputDirectory,
    `chromatogram/${data.sampleID}.tsv`,
  );

  // Write header into both spectrum and chromatogram files
  const spectrumHeader =
    'sampleID\tdate\ttime\tspectrumCount\tindex\tscanID\tarrayLength\tspectrumType\tmsLevel\tscanType\tpolarity\tretentionTime\tscanPresetConfiguration\tscanWindowLowerLimit\tscanWindowUpperLimit\tisolationWindowTarget\tisolationWindowLowerOffset\tisolationWindowUpperOffset\tselectedIonMZ\tcollisionType\tcollisionEnergy\tbasePeakIntensity\tbasePeakMZ\ttotalIonCurrent\tmzArray\tintensityArray\n';
  const chromatogramHeader =
    'sampleID\tdate\ttime\tchromatogramCount\tindex\tid\tarrayLength\tchromatogramType\tpolarity\tdwellTime\tisolationWindowTarget\tcollisionType\tcollisionEnergy\ttimeArray\tintensityArray\tmsLevelArray\tmzArray\n';
  writeFileSync(spectrumFile, spectrumHeader);
  writeFileSync(chromatogramFile, chromatogramHeader);

  // Spectrum data
  if (data.spectrumCount !== 0) {
    for (let i = 0; i < data.spectrumCount; i++) {
      const spectrum = data.spectrum[i];

      appendFileSync(
        spectrumFile,
        `${data.sampleID}\t${data.date}\t${data.time}\t${data.spectrumCount}\t${spectrum.index}\t${spectrum.scanID}\t${spectrum.arrayLength}\t${spectrum.spectrumType}\t${spectrum.msLevel}\t${spectrum.scanType}\t${spectrum.polarity}\t${spectrum.retentionTime}\t${spectrum.scanPresetConfiguration}\t${spectrum.scanWindowLowerLimit}\t${spectrum.scanWindowUpperLimit}\t${spectrum.isolationWindowTarget}\t${spectrum.isolationWindowLowerOffset}\t${spectrum.isolationWindowUpperOffset}\t${spectrum.selectedIonMZ}\t${spectrum.collisionType}\t${spectrum.collisionEnergy}\t${spectrum.basePeakIntensity}\t${spectrum.basePeakMZ}\t${spectrum.totalIonCurrent}\t${spectrum.mzArray}\t${spectrum.intensityArray}\n`,
      );
    }
  } else {
    appendFileSync(
      spectrumFile,
      `${data.sampleID}\t${data.date}\t${data.time}\t${data.spectrumCount}\n`,
    );
  }

  // Chromatogram data
  if (data.chromatogram !== 0) {
    for (let i = 0; i < data.chromatogramCount; i++) {
      const chromatogram = data.chromatogram[i];

      appendFileSync(
        chromatogramFile,
        `${data.sampleID}\t${data.date}\t${data.time}\t${data.chromatogramCount}\t${chromatogram.index}\t${chromatogram.id}\t${chromatogram.arrayLength}\t${chromatogram.chromatogramType}\t${chromatogram.polarity}\t${chromatogram.dwellTime}\t${chromatogram.isolationWindowTarget}\t${chromatogram.collisionType}\t${chromatogram.collisionEnergy}\t${chromatogram.timeArray}\t${chromatogram.intensityArray}\t${chromatogram.msLevelArray}\t${chromatogram.mzArray}\n`,
      );
    }
  }
}
