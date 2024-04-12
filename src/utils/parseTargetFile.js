import { readFileSync } from 'fs';

import fetch from 'node-fetch';
import papa from 'papaparse';

import { roundDecimalPlace } from './roundDecimalPlace.js';

/**
 * Parse target file (tsv) from local file path or a published to web URL.
 * @param {Object} configParam Configuration parameters.
 * @returns {Promise<Object>} A promise that resolves with a m/z target list (array), and the minimum and maximum m/z values to filter for.
 * @throws {Error} Throws error if parseTargetFile() encounters issues in its process.
 */
export async function parseTargetFile(configParam) {
  const urlPattern = /^(?:http|https):\/\/[^ "]+&output=tsv$/;
  const tsvPattern = /\.tsv$/i;
  let data;

  // Check input file pattern against urlPattern and tsvPattern
  if (urlPattern.test(configParam.targetFile)) {
    await fetch(configParam.targetFile)
      .then((response) => response.text())
      .then((fileContent) => {
        ({ data } = papa.parse(fileContent, {
          delimiter: '\t',
          header: true,
        }));
      });
  } else if (tsvPattern.test(configParam.targetFile)) {
    ({ data } = papa.parse(readFileSync(configParam.targetFile, 'utf-8'), {
      delimiter: '\t',
      header: true,
    }));
  }

  // Throw error if data is undefined (targetFile do not match pattern check)
  if (!data) {
    throw new Error(
      'parseTargetFile(): targetFile does not match TSV pattern check',
    );
  }

  // Extract and sort m/z target list (distinct values only)
  // Requires to follow a targetFile layout (header - msLevel and mzValue must be present)
  let mzTargetList = configParam.filterSpectrum
    ? Array.from(
        new Set(
          data
            .filter((row) => configParam.msLevel.includes(Number(row.msLevel)))
            .map((row) => Number(row.mzValue))
            .sort((a, b) => a - b),
        ),
      )
    : Array.from(
        new Set(data.map((row) => Number(row.mzValue)).sort((a, b) => a - b)),
      );

  // Throw error if no m/z data found
  if (
    (mzTargetList.length === 1 && isNaN(mzTargetList[0])) ||
    mzTargetList.length === 0
  ) {
    throw new Error('parseTargetFile(): Target m/z data not found');
  }

  // Round m/z target list if decimal place is defined
  mzTargetList = !isNaN(configParam.decimalPlace)
    ? await Promise.all(
        mzTargetList.map((value) =>
          roundDecimalPlace(value, configParam.decimalPlace),
        ),
      )
    : mzTargetList;

  // Set new minMZ and maxMZ based on extracted target m/z list
  let minMZ = mzTargetList[0] - configParam.mzTolerance;
  let maxMZ = mzTargetList[mzTargetList.length - 1] + configParam.mzTolerance;
  if (!isNaN(configParam.decimalPlace)) {
    minMZ = await roundDecimalPlace(minMZ, configParam.decimalPlace);
    maxMZ = await roundDecimalPlace(maxMZ, configParam.decimalPlace);
  }

  return { mzTargetList, minMZ, maxMZ };
}
