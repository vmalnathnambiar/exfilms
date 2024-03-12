// @ts-nocheck

import { decode } from 'base64-arraybuffer';
import pako from 'pako';

/**
 * Decode binary data based on precision value and compression method used for original encoding.
 * @param {number} precisionValue A precision value that was used to encode the binary data.
 * @param {string} compressionMethod Method of compression used while encoding the binary data.
 * @param {string} encodedData Binary data to be decoded.
 * @returns {Promise<number[]>} A promise that resolves with decoded data array.
 */
export async function decodeBinary(
  precisionValue,
  compressionMethod,
  encodedData,
) {
  let decodedData;

  // Check compression method used
  if (compressionMethod === 'none') {
    decodedData = decode(encodedData);
  } else {
    decodedData = pako.inflate(decode(encodedData)).buffer;
  }

  // Check precision value of the array
  if (precisionValue === 64) {
    return new Float64Array(decodedData);
  } else {
    return new Float32Array(decodedData);
  }
}
