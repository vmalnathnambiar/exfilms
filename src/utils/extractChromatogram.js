/* eslint-disable no-await-in-loop */
// @ts-nocheck

/**
 * @typedef {import('../typedef/index.mjs').Chromatogram} Chromatogram
 */

import { keyMap, valueMap } from './cvParamMap.js';
import { decoder } from './decoder.js';
import { roundDecimalPlace } from './roundDecimalPlace.js';

/**
 * Extract chromatogram data from parsed mzML data.
 * @param {Object} configParam Configuration parameters.
 * @param {array} chromatogramArray An array of chromatogram data contained within the parsed mzML data.
 * @returns {Promise<Chromatogram[]>} A promise that resolves with an array of extracted chromatogram data.
 */
export async function extractChromatogram(configParam, chromatogramArray) {
  /**
   * @type {Chromatogram[]}
   */
  const chromatogram = [];

  // Loop through chromatogram array
  for (const chromatogramData of chromatogramArray) {
    const cvParamMap = chromatogramData.cvParam;
    const userParamMap = chromatogramData.userParam;
    const precursorMap = chromatogramData.precursor;
    const productMap = chromatogramData.product;
    const binaryDataArrayMap =
      chromatogramData.binaryDataArrayList.binaryDataArray;

    // Initialise object to store chromatogram data
    /**
     * @type {Chromatogram}
     */
    const data = {
      index: chromatogramData.$index,
      id: chromatogramData.$id,
      arrayLength: chromatogramData.$defaultArrayLength,
      type: null,
      polarity: null,
      dwellTime: null,
      precursorIsolationWindowTarget: null,
      collisionType: null,
      collisionEnergy: null,
      productIsolationWindowTarget: null,
      timeArray: [],
      intensityArray: [],
      msLevelArray: [],
      mzArray: [],
    };

    // Chromatogram parameters (type, polarity)
    const chromatogramCvParam = Array.isArray(cvParamMap)
      ? cvParamMap
      : [cvParamMap];
    for (const cvParam of chromatogramCvParam) {
      const mappedKey = keyMap[cvParam.$name];
      const mappedValue = valueMap[cvParam.$name];
      const paramValue = cvParam.$value;
      if (mappedKey) {
        data[mappedKey] = mappedValue || paramValue;
      }
    }

    // User parameters (dwellTime)
    if (userParamMap) {
      const userCvParam = Array.isArray(userParamMap)
        ? userParamMap
        : [userParamMap];
      for (const cvParam of userCvParam) {
        const mappedKey = keyMap[cvParam.$name];
        const paramValue = cvParam.$value;
        if (mappedKey) {
          data[mappedKey] = paramValue;
        }
      }
    }

    // Precursor data
    if (precursorMap) {
      const isolationWindowMap = precursorMap.isolationWindow;
      const activationMap = precursorMap.activation;

      // Isolation window parameters (precursorIsolationWindowTarget)
      const isolationWindowCvParam = Array.isArray(isolationWindowMap.cvParam)
        ? isolationWindowMap.cvParam
        : [isolationWindowMap.cvParam];
      for (const cvParam of isolationWindowCvParam) {
        const mappedKey = keyMap[cvParam.$name];
        const paramValue = cvParam.$value;
        if (mappedKey) {
          if (mappedKey === 'isolationWindowTarget') {
            data.precursorIsolationWindowTarget = paramValue;
          } else {
            data[mappedKey] = paramValue;
          }
        }
      }

      // Activation parameters (collisionType, collisionEnergy)
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

    // Product data
    if (productMap) {
      const isolationWindowMap = productMap.isolationWindow;

      // Isolation window parameters (productIsolationWindowTarget)
      const isolationWindowCvParam = Array.isArray(isolationWindowMap.cvParam)
        ? isolationWindowMap.cvParam
        : [isolationWindowMap.cvParam];
      for (const cvParam of isolationWindowCvParam) {
        const mappedKey = keyMap[cvParam.$name];
        const paramValue = cvParam.$value;
        if (mappedKey) {
          if (mappedKey === 'isolationWindowTarget') {
            data.productIsolationWindowTarget = paramValue;
          } else {
            data[mappedKey] = paramValue;
          }
        }
      }
    }

    // Binary data array (timeArray, intensityArray, msLevelArray)
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

          if (
            mappedKey === 'timeArray' ||
            mappedKey === 'intensityArray' ||
            mappedKey === 'msLevelArray'
          ) {
            let decodedBinary = Array.from(
              await decoder(
                encoder.precision,
                encoder.compression,
                binaryData.binary,
              ),
            );

            if (mappedKey === 'timeArray' && !isNaN(configParam.decimalPlace)) {
              decodedBinary = await Promise.all(
                decodedBinary.map((value) =>
                  roundDecimalPlace(value, configParam.decimalPlace),
                ),
              );
            }

            data[mappedKey] = decodedBinary;
            decodedBinary = [];
          }
        }
      }
    }

    // Add chromatogram data to array
    chromatogram.push(data);
  }

  return chromatogram;
}
