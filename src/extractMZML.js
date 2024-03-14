/**
 * @typedef {import('../typedef.mjs').MS} MS
 */

import { extractChromatogram } from './extractChromatogram.js';
import { extractSpectrum } from './extractSpectrum.js';
import { extractTimeStamp } from './extractTimeStamp.js';
import { initChromatogramArray } from './initChromatogramArray.js';
import { writeJSON } from './writeJSON.js';
import { writeTSV } from './writeTSV.js';

/**
 * extract MS data from parsed mzML.
 * @param {Object} configParam Configuration parameters passed via the command line interface.
 * @param {Object} msData An object that contains all MS data parsed from the mzML file.
 * @returns {Promise<void>} A promise that resolves when the extraction process is complete.
 * @throws {Error} Throws error if extractMZML() encounters issues in its process.
 */
export async function extractMZML(configParam, msData) {
  const mzmlMap = msData.indexedmzML.mzML;
  const runMap = mzmlMap.run;
  const spectrumListMap = runMap.spectrumList;
  const chromatogramListMap = runMap.chromatogramList;
  const timeStamp = await extractTimeStamp(runMap.$startTimeStamp);

  // General MS data
  const sampleID = mzmlMap.$id;
  const date = timeStamp.date;
  const time = timeStamp.time;

  let spectrumCount = 0;
  let spectrum = [];
  let chromatogramCount = 0;
  let chromatogram = [];

  // Check if spectrum array exists in parsed mzML and extract data accordingly
  if (spectrumListMap) {
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
  let data = {
    sampleID,
    date,
    time,
    spectrumCount,
    spectrum,
    chromatogramCount,
    chromatogram,
  };

  // Write output file
  if (configParam.outputFormat === 'JSON') {
    await writeJSON(configParam.outputDirectory, data);
  } else if (configParam.outputFormat === 'TSV') {
    await writeTSV(configParam.outputDirectory, data);
  }
}
