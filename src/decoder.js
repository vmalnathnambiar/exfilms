import { decode } from 'base64-arraybuffer';
import pako from 'pako';

/**
 * Decode encoded data based on precision value and compression method used for original encoding.
 * @param {number} precisionValue A precision value that was used to encode the binary data.
 * @param {string} compressionMethod Method of compression used while encoding the binary data.
 * @param {string} encodedData Encoded data to be decoded.
 * @returns {Promise<Float64Array|Float32Array>} A promise that resolves with decoded Float64 or Float32 array.
 * @throws {Error} Throws error if decoder() encounters issues in its process.
 */
export async function decoder(precisionValue, compressionMethod, encodedData) {
  // Check input type
  if (typeof precisionValue !== 'number') {
    throw new Error('\ndecoder() - precisionValue must be of type number');
  } else if (precisionValue !== 64 && precisionValue !== 32) {
    throw new Error('\ndecoder() - precisionValue defined not valid');
  } else if (typeof compressionMethod !== 'string') {
    throw new Error('\ndecoder() - compressionMethod must be of type string');
  } else if (compressionMethod !== 'none' && compressionMethod !== 'zlib') {
    throw new Error('\ndecoder() - compressionMethod defined not valid');
  } else if (typeof encodedData !== 'string') {
    throw new Error('\ndecoder() - encodedData must be of type string');
  }

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
