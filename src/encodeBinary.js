// @ts-nocheck

import { encode } from 'base64-arraybuffer';
import pako from 'pako';

/**
 * Decode binary data based on precision value and compression method used for original encoding.
 * @param {number} precisionValue A precision value that was used to encode the binary data.
 * @param {string} compressionMethod Method of compression used while encoding the binary data.
 * @param {number[]} decodedData Data to be encoded.
 * @returns {Promise<string>} A promise that resolves with encoded binary data.
 */
export async function encodeBinary(
  precisionValue,
  compressionMethod,
  decodedData,
) {
  let encodedData;
  let dataBuffer;

  // Check precision value of the array
  if (precisionValue === 64) {
    dataBuffer = new Float64Array(decodedData);
  } else {
    dataBuffer = new Float32Array(decodedData);
  }

  // Check compression method used
  if (compressionMethod === 'none') {
    encodedData = encode(dataBuffer.buffer);
  } else {
    encodedData = encode(pako.deflate(dataBuffer.buffer));
  }

  return encodedData;
}
