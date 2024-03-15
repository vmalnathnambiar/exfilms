/* eslint-disable no-await-in-loop */
// @ts-nocheck

/**
 * @typedef {import('./typedef.mjs').Chromatogram} Chromatogram
 * @typedef {import('./typedef.mjs').Spectrum} Spectrum
 */

import { keyMap, valueMap } from './cvParamMap.js';
import { decodeBinary } from './decodeBinary.js';
import { extractBasePeakMZ } from './extractBasePeakMZ.js';
import { filterSpectrum } from './filterSpectrum.js';
import { roundDecimalPlace } from './roundDecimalPlace.js';

/**
 * Extract spectrum data from parsed mzML data.
 * @param {Object} configParam Configuration parameters passed via the command line interface.
 * @param {array} spectrumArray An array of spectrum data contained within the parsed mzML data.
 * @param {Chromatogram[]} chromatogram An array of chromatogram data defined by initChromatogramArray to be used for the extraction (and filtration) process.
 * @returns {Promise<Object>} A promise that resolves with an object containing the extracted spectrum count, spectrum data array and chromatogram data array .
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
      scanID: spectrumData.$id,
      arrayLength: spectrumData.$defaultArrayLength,
      spectrumType: null,
      msLevel: null,
      scanType: null,
      polarity: null,
      retentionTime: null,
      scanPresetConfiguration: null,
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
      let paramValue = cvParam.$value;
      const mappedValue = valueMap[cvParam.$name];

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
      } else if (mappedKey === 'scanPresetConfiguration') {
        data[mappedKey] = paramValue;
      }
    }

    // Scan window parameters
    const scanWindowCvParam = Array.isArray(scanWindowMap.cvParam)
      ? scanWindowMap.cvParam
      : [scanWindowMap.cvParam];
    for (const cvParam of scanWindowCvParam) {
      const mappedKey = keyMap[cvParam.$name];
      if (mappedKey) {
        data[mappedKey] = cvParam.$value;
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
        if (mappedKey) {
          data[mappedKey] = cvParam.$value;
        }
      }

      // Selected ion parameters
      const selectedIonCvParam = Array.isArray(selectedIonMap.cvParam)
        ? selectedIonMap.cvParam
        : [selectedIonMap.cvParam];
      for (const cvParam of selectedIonCvParam) {
        const mappedKey = keyMap[cvParam.$name];
        if (mappedKey) {
          data[mappedKey] = cvParam.$value;
        }
      }

      // Activation parameters
      const activationCvParam = Array.isArray(activationMap.cvParam)
        ? activationMap.cvParam
        : [activationMap.cvParam];
      for (const cvParam of activationCvParam) {
        const mappedKey = keyMap[cvParam.$name];
        const mappedValue = valueMap[cvParam.$name];
        if (mappedKey) {
          data[mappedKey] = mappedValue || cvParam.$value;
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
              await decodeBinary(
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

    // Filter spectrum data (m/z and intensity) if true
    if (configParam.minMZ && (configParam.maxMZ || isNaN(configParam.maxMZ))) {
      const filteredData = await filterSpectrum(
        configParam,
        data.spectrumType,
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

    // Empty spectra data arrays (m/z and intensities) if true
    if (configParam.excludeSpectra) {
      data.mzArray = [];
      data.intensityArray = [];
    }

    // Filter for spectrum type, msLevel and polarity (if filter applied)
    // And append spectrum data object to spectrum array
    // And update chromatogram (Total Ion Chromatogram and Base Peak Chromatogram) data
    const ticIDX = chromatogram.findIndex((chromObj) => chromObj.id === 'TIC');
    const bpcIDX = chromatogram.findIndex((chromObj) => chromObj.id === 'BPC');
    if (configParam.filterSpectrumData) {
      if (
        configParam.spectrumType.includes(data.spectrumType) &&
        configParam.msLevel.includes(data.msLevel) &&
        configParam.polarity.includes(data.polarity)
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
