// @ts-nocheck

import { encode } from 'base64-arraybuffer';
import pako from 'pako';

/**
 * Decode binary data based on precision value and compression method used for original encoding.
 * @param {number} precisionValue A precision value that was used to encode the binary data.
 * @param {string} compressionMethod Method of compression used while encoding the binary data.
 * @param {ArrayBufferLike|ArrayLike<number>|Iterable<number>|number} decodedData Data to be encoded.
 * @returns {Promise<string>} A promise that resolves with encoded data string.
 */
export async function encodeBinary(
  precisionValue,
  compressionMethod,
  decodedData,
) {
  // Check input type
  if (typeof precisionValue !== 'number') {
    throw new Error('\nencodeBinary() - precisionValue must be of type number');
  } else if (precisionValue !== 64 && precisionValue !== 32) {
    throw new Error('\nencodeBinary() - precisionValue defined not valid');
  } else if (typeof compressionMethod !== 'string') {
    throw new Error(
      '\nencodeBinary() - compressionMethod must be of type string',
    );
  } else if (compressionMethod !== 'none' && compressionMethod !== 'zlib') {
    throw new Error('\nencodeBinary() - compressionMethod defined not valid');
  } else if (
    !Array.isArray(decodedData) &&
    !(decodedData instanceof ArrayBuffer) &&
    typeof decodedData !== 'number'
  ) {
    throw new Error(
      '\nencodeBinary() - decodedData must be of type ArrayBufferLike, ArrayLike<number>, Iterable<number> or number',
    );
  }

  let dataBuffer;

  // Check precision value of the array
  if (precisionValue === 64) {
    dataBuffer = new Float64Array(decodedData);
  } else {
    dataBuffer = new Float32Array(decodedData);
  }

  // Check compression method used
  if (compressionMethod === 'none') {
    return encode(dataBuffer.buffer);
  } else {
    return encode(pako.deflate(dataBuffer.buffer));
  }
}
