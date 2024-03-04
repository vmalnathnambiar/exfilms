// @ts-nocheck

import { decode } from 'base64-arraybuffer';
import pako from 'pako';

/**
 * Decode binary data based on precision value and compression method used for original encoding.
 * @param {number} precisionValue A precision value that was used to encode the binary data.
 * @param {string} compressionMethod Method of compression used while encoding the binary data.
 * @param {string} binaryData Binary data to be decoded.
 * @returns {Promise<number[]>} A promise that resolves with decoded array buffer containing all values in the same order as they were encoded.
 */
export async function decodeBinary(
  precisionValue,
  compressionMethod,
  binaryData,
) {
  let decodedBinary;

  // Check compression method used
  if (compressionMethod === 'none') {
    decodedBinary = decode(binaryData);
  } else {
    decodedBinary = pako.deflate(decode(binaryData));
  }

  // Check precision value of the array
  if (precisionValue === 64) {
    return new Float64Array(decodedBinary);
  } else {
    return new Float32Array(decodedBinary);
  }
}
