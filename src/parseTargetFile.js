import { readFileSync } from 'fs';

import fetch from 'node-fetch';
import papa from 'papaparse';

import { configParam } from '../bin/exfil-ms.js';

import { roundDecimalPlace } from './roundDecimalPlace.js';

// Parse target file (tsv) from local file path or a published to web URL
export async function parseTargetFile() {
  const urlPattern = /^(?:http|https):\/\/[^ "]+&output=tsv$/;
  const tsvPattern = /\.tsv$/i;
  let data;

  try {
    // Check input pattern against urlPattern and tsvPattern
    if (urlPattern.test(configParam.targetFile)) {
      await fetch(configParam.targetFile)
        .then((response) => response.text())
        .then((fileContent) => {
          ({ data } = papa.parse(fileContent, {
            delimiter: '\t',
            header: true,
          }));
        });
    }

    if (tsvPattern.test(configParam.targetFile)) {
      ({ data } = papa.parse(readFileSync(configParam.targetFile, 'utf-8'), {
        delimiter: '\t',
        header: true,
      }));
    }

    // Throw err if data is undefined
    if (!data) {
      throw new Error('\nInvalid target file - Data undefined');
    }

    // Extract and sort m/z target list (distinct values only)
    let mzTargetList = configParam.filterSpectrum
      ? Array.from(
          new Set(
            data
              .filter((row) =>
                configParam.msLevel.includes(Number(row.msLevel)),
              )
              .map((row) => Number(row.mzValue))
              .sort((a, b) => a - b),
          ),
        )
      : Array.from(
          new Set(data.map((row) => Number(row.mzValue)).sort((a, b) => a - b)),
        );

    // Throw err if no m/z data found
    if (mzTargetList.length === 0) {
      throw new Error('\nInvalid target file - Targeted m/z data not found');
    }

    // Round m/z target list if decimal place is configured
    mzTargetList = !isNaN(configParam.decimalPlace)
      ? await Promise.all(
          mzTargetList.map((value) =>
            roundDecimalPlace(value, configParam.decimalPlace),
          ),
        )
      : mzTargetList;

    // Set new minMZ and maxMZ based on extracted m/z target list
    const minMZ = mzTargetList[0] - configParam.mzTolerance;
    const maxMZ =
      mzTargetList[mzTargetList.length - 1] + configParam.mzTolerance;

    return { mzTargetList, minMZ, maxMZ };
  } catch (err) {
    throw err.toString();
  }
}
