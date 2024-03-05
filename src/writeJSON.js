import { writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';

/**
 * Write extracted (and filtered) MS data into JSON file in output directory.
 * @param {Object} configParam Configuration parameters passed via the command line interface.
 * @param {Object} data MS data extracted from parsed mzML file.
 * @returns {Promise<void>} A Promise that resolves when the writing to JSON file is complete.
 */
export async function writeJSON(configParam, data) {
  const jsonFile = join(configParam.outputDirectory, `${data.sampleID}.json`);

  writeFileSync(jsonFile, '{\n');
  appendFileSync(jsonFile, `\t"sampleID": "${data.sampleID}",\n`);
  appendFileSync(jsonFile, `\t"date": "${data.date}",\n`);
  appendFileSync(jsonFile, `\t"time": "${data.time}",\n`);
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
