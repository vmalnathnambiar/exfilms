/**
 * @typedef {import('../typedef.mjs').MS} MS
 */
import { writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';

/**
 * Write extracted (and filtered) MS data into JSON file in output directory.
 * @param {string} outputDirectory Output directory path.
 * @param {MS} data MS data extracted from parsed mzML file.
 * @returns {Promise<void>} A Promise that resolves when the writing to JSON file is complete.
 */
export async function writeJSON(outputDirectory, data) {
  // Check input type
  if (typeof outputDirectory !== 'string') {
    throw new Error('\nwriteJSON() - outputDirectory must be of type string');
  }

  // Output file path
  const jsonFile = join(outputDirectory, `${data.sampleID}.json`);

  // File metadata
  writeFileSync(jsonFile, '{\n');
  appendFileSync(jsonFile, `\t"sampleID": "${data.sampleID}",\n`);
  if (data.date !== null) {
    appendFileSync(jsonFile, `\t"date": "${data.date}",\n`);
  } else {
    appendFileSync(jsonFile, `\t"date": ${data.date},\n`);
  }

  if (data.time !== null) {
    appendFileSync(jsonFile, `\t"time": "${data.time}",\n`);
  } else {
    appendFileSync(jsonFile, `\t"time": ${data.time},\n`);
  }

  // Spectrum data
  appendFileSync(jsonFile, `\t"spectrumCount": ${data.spectrumCount},\n`);
  appendFileSync(jsonFile, '\t"spectrum": [\n');
  if (data.spectrumCount !== 0) {
    for (let i = 0; i < data.spectrumCount; i++) {
      const spectrum = data.spectrum[i];

      appendFileSync(jsonFile, '\t\t{\n');
      Object.entries(spectrum).forEach(([key, value], index) => {
        if (
          (key === 'scanID' ||
            key === 'spectrumType' ||
            key === 'scanType' ||
            key === 'polarity' ||
            key === 'collisionType') &&
          value !== null
        ) {
          appendFileSync(jsonFile, `\t\t\t"${key}": "${value}"`);
        } else if (key === 'mzArray' || key === 'intensityArray') {
          appendFileSync(jsonFile, `\t\t\t"${key}": [${value}]`);
        } else {
          appendFileSync(jsonFile, `\t\t\t"${key}": ${value}`);
        }
        appendFileSync(
          jsonFile,
          index < Object.keys(spectrum).length - 1 ? ',\n' : '\n',
        );
      });
      appendFileSync(
        jsonFile,
        `\t\t}${i !== data.spectrumCount - 1 ? ',' : ''}\n`,
      );
    }
  }
  appendFileSync(jsonFile, '\t],\n');

  // Chromatogram data
  appendFileSync(
    jsonFile,
    `\t"chromatogramCount": ${data.chromatogramCount},\n`,
  );
  appendFileSync(jsonFile, '\t"chromatogram": [\n');
  if (data.chromatogramCount !== 0) {
    for (let i = 0; i < data.chromatogramCount; i++) {
      const chromatogram = data.chromatogram[i];

      appendFileSync(jsonFile, '\t\t{\n');
      Object.entries(chromatogram).forEach(([key, value], index) => {
        if (
          (key === 'id' ||
            key === 'chromatogramType' ||
            key === 'polarity' ||
            key === 'collisionType') &&
          value !== null
        ) {
          appendFileSync(jsonFile, `\t\t\t"${key}": "${value}"`);
        } else if (
          key === 'timeArray' ||
          key === 'intensityArray' ||
          key === 'msLevelArray' ||
          key === 'mzArray'
        ) {
          appendFileSync(jsonFile, `\t\t\t"${key}": [${value}]`);
        } else {
          appendFileSync(jsonFile, `\t\t\t"${key}": ${value}`);
        }
        appendFileSync(
          jsonFile,
          index < Object.keys(chromatogram).length - 1 ? ',\n' : '\n',
        );
      });
      appendFileSync(
        jsonFile,
        `\t\t}${i !== data.chromatogramCount - 1 ? ',' : ''}\n`,
      );
    }
  }
  appendFileSync(jsonFile, '\t]\n');
  appendFileSync(jsonFile, '}');
}
