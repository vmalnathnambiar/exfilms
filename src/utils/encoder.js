// @ts-nocheck

import { encode } from 'base64-arraybuffer';
import pako from 'pako';

/**
 * Encode data based on precision value and compression method used for original encoding.
 * @param {number} precisionValue Precision value to be used for encoding.
 * @param {string} compressionMethod Method of compression to be used for encoding.
 * @param {ArrayBufferLike|ArrayLike<number>|Iterable<number>|number} data Data to be encoded.
 * @returns {Promise<string>} A promise that resolves with encoded data string.
 * @throws {Error} Throws error if encoder() encounters issues in its process.
 */
export async function encoder(precisionValue, compressionMethod, data) {
  // Check input type
  if (typeof precisionValue !== 'number') {
    throw new Error('\nencoder() - precisionValue must be of type number');
  } else if (precisionValue !== 64 && precisionValue !== 32) {
    throw new Error('\nencoder() - precisionValue defined not valid');
  } else if (typeof compressionMethod !== 'string') {
    throw new Error('\nencoder() - compressionMethod must be of type string');
  } else if (compressionMethod !== 'none' && compressionMethod !== 'zlib') {
    throw new Error('\nencoder() - compressionMethod defined not valid');
  } else if (
    !Array.isArray(data) &&
    !(data instanceof ArrayBuffer) &&
    typeof data !== 'number'
  ) {
    throw new Error(
      '\nencoder() - data must be of type ArrayBufferLike, ArrayLike<number>, Iterable<number> or number',
    );
  }

  let dataBuffer;

  // Check precision value of the array
  if (precisionValue === 64) {
    dataBuffer = new Float64Array(data);
  } else {
    dataBuffer = new Float32Array(data);
  }

  // Check compression method used
  if (compressionMethod === 'none') {
    return encode(dataBuffer.buffer);
  } else {
    return encode(pako.deflate(dataBuffer.buffer));
  }
}
