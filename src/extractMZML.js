import { configParam } from '../bin/exfilms.js';

import { extractChromatogram } from './extractChromatogram.js';
import { extractSpectrum } from './extractSpectrum.js';
import { extractTimeStamp } from './extractTimeStamp.js';
import { initChromatogramArray } from './initChromatogramArray.js';
import { writeJSON } from './writeJSON.js';
import { writeTSV } from './writeTSV.js';

// Extract MS data from the parsed mzML data file
export async function extractMZML(msData) {
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

  // Check if spectrum array exists and extract data accordingly
  if (spectrumListMap) {
    // Initialise chromatogram array to store chromatogram data
    chromatogram = await initChromatogramArray();
    chromatogramCount = chromatogram.length;

    // Extract spectrum data
    const spectrumArray = Array.isArray(spectrumListMap.spectrum)
      ? spectrumListMap.spectrum
      : [spectrumListMap.spectrum];
    const spectrumData = await extractSpectrum(spectrumArray, chromatogram);
    spectrumCount = spectrumData.spectrumCount;
    spectrum = spectrumData.spectrum;
    chromatogram = spectrumData.chromatogram;
  } else {
    // Extract chromatogram data
    chromatogramCount = chromatogramListMap.$count;
    const chromatogramArray = Array.isArray(chromatogramListMap.chromatogram)
      ? chromatogramListMap.chromatogram
      : [chromatogramListMap.chromatogram];
    chromatogram = await extractChromatogram(chromatogramArray);
  }

  // Combine all MS data into a standardized data object
  let data = {
    sampleID,
    date,
    time,
    spectrumCount,
    spectrum,
    chromatogramCount,
    chromatogram,
  };

  // Write JSON file
  if (configParam.outputFormat === 'JSON') {
    await writeJSON(data);
  } else {
    await writeTSV(data);
  }
}
