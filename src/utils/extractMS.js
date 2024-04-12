/**
 * @typedef {import('../typedef/index.mjs').Spectrum} Spectrum
 * @typedef {import('../typedef/index.mjs').Chromatogram} Chromatogram
 * @typedef {import('../typedef/index.mjs').MS} MS
 */

import { extractChromatogram } from './extractChromatogram.js';
import { extractSpectrum } from './extractSpectrum.js';
import { extractTimestamp } from './extractTimestamp.js';
import { initChromatogramArray } from './initChromatogramArray.js';
import { writeJSON } from './writeJSON.js';
import { writeTSV } from './writeTSV.js';

/**
 * Extract MS data from parsed mzML.
 * @param {Object} configParam Configuration parameters.
 * @param {Object} data Parsed mzML data.
 * @returns {Promise<void>} A promise that resolves when the extraction process is complete.
 * @throws {Error} Throws error if extractMS() encounters issues in its process.
 */
export async function extractMS(configParam, data) {
  const mzmlMap = data.indexedmzML.mzML;
  const runMap = mzmlMap.run;
  const spectrumListMap = runMap.spectrumList;
  const chromatogramListMap = runMap.chromatogramList;
  const timestamp = await extractTimestamp(runMap.$startTimeStamp);

  // General MS data
  const id = mzmlMap.$id;
  const date = timestamp.date;
  const time = timestamp.time;

  /**
   * @type {Spectrum[]}
   */
  let spectrum = [];
  let spectrumCount = 0;

  /**
   * @type {Chromatogram[]}
   */
  let chromatogram = [];
  let chromatogramCount = 0;

  // Check if spectrum list exists in parsed mzML and extract data accordingly
  if (spectrumListMap) {
    // If spectrum list exist
    // Initialise chromatogram array to store chromatogram data
    chromatogram = await initChromatogramArray(configParam);
    chromatogramCount = chromatogram.length;

    // Extract spectrum data
    const spectrumArray = Array.isArray(spectrumListMap.spectrum)
      ? spectrumListMap.spectrum
      : [spectrumListMap.spectrum];
    const spectrumData = await extractSpectrum(
      configParam,
      spectrumArray,
      chromatogram,
    );
    spectrumCount = spectrumData.spectrumCount;
    spectrum = spectrumData.spectrum;
    chromatogram = spectrumData.chromatogram;
  } else {
    // Extract chromatogram data
    chromatogramCount = chromatogramListMap.$count;
    const chromatogramArray = Array.isArray(chromatogramListMap.chromatogram)
      ? chromatogramListMap.chromatogram
      : [chromatogramListMap.chromatogram];
    chromatogram = await extractChromatogram(configParam, chromatogramArray);
  }

  // Combine all MS data into a standardized data object
  /**
   * @type {MS}
   */
  const msData = {
    id,
    date,
    time,
    spectrumCount,
    spectrum,
    chromatogramCount,
    chromatogram,
  };

  // Write output file
  if (configParam.outputFormat === 'JSON') {
    await writeJSON(configParam.outputDirectory, msData);
  } else if (configParam.outputFormat === 'TSV') {
    await writeTSV(configParam.outputDirectory, msData);
  }
}
