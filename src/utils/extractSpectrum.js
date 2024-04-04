/* eslint-disable no-await-in-loop */
// @ts-nocheck

/**
 * @typedef {import('../typedef/index.mjs').Chromatogram} Chromatogram
 * @typedef {import('../typedef/index.mjs').Spectrum} Spectrum
 */

import { keyMap, valueMap } from './cvParamMap.js';
import { decoder } from './decoder.js';
import { extractBasePeakMZ } from './extractBasePeakMZ.js';
import { filterSpectra } from './filterSpectra.js';
import { roundDecimalPlace } from './roundDecimalPlace.js';

/**
 * Extract spectrum data from parsed mzML data.
 * @param {Object} configParam Configuration parameters passed via the command line interface.
 * @param {array} spectrumArray An array of spectrum data contained within the parsed mzML data.
 * @param {Chromatogram[]} chromatogram An array of chromatogram data defined by initChromatogramArray to be used for the extraction (and filtration) process.
 * @returns {Promise<Object>} A promise that resolves with an object containing the extracted spectrum count, spectrum data array and chromatogram data array.
 */
export async function extractSpectrum(
  configParam,
  spectrumArray,
  chromatogram,
) {
  let spectrumCount = 0;
  let spectrum = [];

  // Loop through spectrum array
  for (const spectrumData of spectrumArray) {
    const scanMap = spectrumData.scanList.scan;
    const scanWindowMap = scanMap.scanWindowList.scanWindow;
    const precursorListMap = spectrumData.precursorList;
    const binaryDataArrayMap = spectrumData.binaryDataArrayList.binaryDataArray;

    // Initialise object to store spectrum data
    /**
     * @type {Spectrum}
     */
    const data = {
      index: spectrumData.$index,
      id: spectrumData.$id,
      arrayLength: spectrumData.$defaultArrayLength,
      type: null,
      msLevel: null,
      scanType: null,
      polarity: null,
      retentionTime: null,
      presetScanConfiguration: null,
      inverseReducedIonMobility: null,
      scanWindowLowerLimit: null,
      scanWindowUpperLimit: null,
      isolationWindowTarget: null,
      isolationWindowLowerOffset: null,
      isolationWindowUpperOffset: null,
      selectedIonMZ: null,
      collisionType: null,
      collisionEnergy: null,
      basePeakIntensity: 0,
      basePeakMZ: 0,
      totalIonCurrent: 0,
      mzArray: [],
      intensityArray: [],
    };

    // Spectrum parameters
    const spectrumCvParam = Array.isArray(spectrumData.cvParam)
      ? spectrumData.cvParam
      : [spectrumData.cvParam];
    for (const cvParam of spectrumCvParam) {
      const mappedKey = keyMap[cvParam.$name];
      const mappedValue = valueMap[cvParam.$name];
      let paramValue = cvParam.$value;

      if (mappedKey) {
        if (mappedKey === 'basePeakMZ') {
          paramValue = !isNaN(configParam.decimalPlace)
            ? await roundDecimalPlace(paramValue, configParam.decimalPlace)
            : paramValue;
        }
        data[mappedKey] = mappedValue || paramValue;
      }
    }

    // Scan parameters
    const scanCvParam = Array.isArray(scanMap.cvParam)
      ? scanMap.cvParam
      : [scanMap.cvParam];
    for (const cvParam of scanCvParam) {
      const mappedKey = keyMap[cvParam.$name];
      let paramValue = cvParam.$value;
      const paramUnit = cvParam.$unitName;

      if (mappedKey === 'retentionTime') {
        paramValue = paramUnit === 'second' ? paramValue / 60 : paramValue;
        data[mappedKey] = !isNaN(configParam.decimalPlace)
          ? await roundDecimalPlace(paramValue, configParam.decimalPlace)
          : paramValue;
      } else if (
        mappedKey === 'presetScanConfiguration' ||
        mappedKey === 'inverseReducedIonMobility'
      ) {
        data[mappedKey] = paramValue;
      }
    }

    // Scan window parameters
    const scanWindowCvParam = Array.isArray(scanWindowMap.cvParam)
      ? scanWindowMap.cvParam
      : [scanWindowMap.cvParam];
    for (const cvParam of scanWindowCvParam) {
      const mappedKey = keyMap[cvParam.$name];
      const paramValue = cvParam.$value;
      if (mappedKey) {
        data[mappedKey] = paramValue;
      }
    }

    // Precursor data
    if (precursorListMap) {
      const precursorMap = precursorListMap.precursor;
      const isolationWindowMap = precursorMap.isolationWindow;
      const selectedIonMap = precursorMap.selectedIonList.selectedIon;
      const activationMap = precursorMap.activation;

      // Isolation window parameters
      const isolationWindowCvParam = Array.isArray(isolationWindowMap.cvParam)
        ? isolationWindowMap.cvParam
        : [isolationWindowMap.cvParam];
      for (const cvParam of isolationWindowCvParam) {
        const mappedKey = keyMap[cvParam.$name];
        const paramValue = cvParam.$value;
        if (mappedKey) {
          data[mappedKey] = paramValue;
        }
      }

      // Selected ion parameters
      const selectedIonCvParam = Array.isArray(selectedIonMap.cvParam)
        ? selectedIonMap.cvParam
        : [selectedIonMap.cvParam];
      for (const cvParam of selectedIonCvParam) {
        const mappedKey = keyMap[cvParam.$name];
        const paramValue = cvParam.$value;
        if (mappedKey) {
          data[mappedKey] = paramValue;
        }
      }

      // Activation parameters
      const activationCvParam = Array.isArray(activationMap.cvParam)
        ? activationMap.cvParam
        : [activationMap.cvParam];
      for (const cvParam of activationCvParam) {
        const mappedKey = keyMap[cvParam.$name];
        const mappedValue = valueMap[cvParam.$name];
        const paramValue = cvParam.$value;
        if (mappedKey) {
          data[mappedKey] = mappedValue || paramValue;
        }
      }
    }

    // Spectrum binary data array
    for (const binaryData of binaryDataArrayMap) {
      const binaryCvParam = Array.isArray(binaryData.cvParam)
        ? binaryData.cvParam
        : [binaryData.cvParam];

      const encoder = {
        precision: null,
        compression: null,
      };

      for (const cvParam of binaryCvParam) {
        const mappedKey = keyMap[cvParam.$name];
        const mappedValue = valueMap[cvParam.$name];
        if (mappedKey) {
          if (mappedValue) {
            encoder[mappedKey] = mappedValue;
          }

          if (mappedKey === 'mzArray' || mappedKey === 'intensityArray') {
            let decodedBinary = Array.from(
              await decoder(
                encoder.precision,
                encoder.compression,
                binaryData.binary,
              ),
            );

            if (mappedKey === 'mzArray' && !isNaN(configParam.decimalPlace)) {
              decodedBinary = await Promise.all(
                decodedBinary.map((value) =>
                  roundDecimalPlace(value, configParam.decimalPlace),
                ),
              );
            }

            data[mappedKey] = decodedBinary;
            decodedBinary = null;
          }
        }
      }
    }

    // Extract base peak m/z if not found in data file
    if (data.arrayLength !== 0 && data.basePeakMZ === 0) {
      data.basePeakMZ = await extractBasePeakMZ(
        data.mzArray,
        data.intensityArray,
      );
    }

    // Spectra filtering if defined
    // Append data to Extracted Ion Chromatogram array (for targeted m/z filtering method)
    if (configParam.targeted || configParam.mzRange) {
      const filteredData = await filterSpectra(
        configParam,
        data.type,
        data.msLevel,
        data.polarity,
        data.retentionTime,
        data.mzArray,
        data.intensityArray,
        chromatogram,
      );
      chromatogram = filteredData.chromatogram;
      data.arrayLength = filteredData.mzValues.length;
      data.basePeakIntensity = filteredData.basePeakIntensity;
      data.basePeakMZ = filteredData.basePeakMZ;
      data.totalIonCurrent = filteredData.totalIonCurrent;
      data.mzArray = filteredData.mzValues;
      data.intensityArray = filteredData.intensityValues;
    }

    // Exclude spectra data if defined
    if (configParam.excludeSpectra) {
      data.mzArray = [];
      data.intensityArray = [];
    }

    // Spectrum data filtering based on properties (if defined)
    // Add data object to spectrum array
    // Append data to Total Ion Chromatogram (TIC) and Base Peak Chromatogram (BPC)
    const ticIDX = chromatogram.findIndex((chromObj) => chromObj.id === 'TIC');
    const bpcIDX = chromatogram.findIndex((chromObj) => chromObj.id === 'BPC');
    if (configParam.filterSpectrum) {
      if (
        configParam.spectrumType.includes(data.type) &&
        configParam.msLevel.includes(data.msLevel) &&
        configParam.spectrumPolarity.includes(data.polarity)
      ) {
        data.index = spectrumCount;
        spectrumCount++;

        spectrum.push(data);

        chromatogram[ticIDX].timeArray.push(data.retentionTime);
        chromatogram[ticIDX].intensityArray.push(data.totalIonCurrent);
        chromatogram[ticIDX].msLevelArray.push(data.msLevel);

        chromatogram[bpcIDX].timeArray.push(data.retentionTime);
        chromatogram[bpcIDX].intensityArray.push(data.basePeakIntensity);
        chromatogram[bpcIDX].msLevelArray.push(data.msLevel);
        chromatogram[bpcIDX].mzArray.push(data.basePeakMZ);
      }
    } else {
      spectrumCount++;

      spectrum.push(data);

      chromatogram[ticIDX].timeArray.push(data.retentionTime);
      chromatogram[ticIDX].intensityArray.push(data.totalIonCurrent);
      chromatogram[ticIDX].msLevelArray.push(data.msLevel);

      chromatogram[bpcIDX].timeArray.push(data.retentionTime);
      chromatogram[bpcIDX].intensityArray.push(data.basePeakIntensity);
      chromatogram[bpcIDX].msLevelArray.push(data.msLevel);
      chromatogram[bpcIDX].mzArray.push(data.basePeakMZ);
    }
  }

  // Define array length of all chromatogram objects
  for (const chrom of chromatogram) {
    chrom.arrayLength = chrom.timeArray.length;
  }

  return { spectrumCount, spectrum, chromatogram };
}
