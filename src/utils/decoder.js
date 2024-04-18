import { decode } from 'base64-arraybuffer';
import pako from 'pako';

/**
 * Decode encoded data based on precision value and compression method used for original encoding.
 * @param {number} precisionValue Precision value used for encoding.
 * @param {string} compressionMethod Method of compression used for encoding.
 * @param {string} encodedData Encoded data to be decoded.
 * @returns {Promise<Float64Array|Float32Array>} A promise that resolves with decoded Float64 or Float32 array.
 * @throws {Error} Throws error if decoder() encounters issues in its process.
 */
export async function decoder(precisionValue, compressionMethod, encodedData) {
  // Check input type
  if (typeof precisionValue !== 'number') {
    throw new Error('decoder(): precisionValue must be of type number');
  } else if (precisionValue !== 64 && precisionValue !== 32) {
    throw new Error('decoder(): precisionValue defined not valid');
  } else if (typeof compressionMethod !== 'string') {
    throw new Error('decoder(): compressionMethod must be of type string');
  } else if (compressionMethod !== 'none' && compressionMethod !== 'zlib') {
    throw new Error('decoder(): compressionMethod defined not valid');
  } else if (typeof encodedData !== 'string') {
    throw new Error('decoder(): encodedData must be of type string');
  }

  let decodedData;

  // Check if encodedData is empty
  if (encodedData.length === 0) {
    return precisionValue === 64 ? new Float64Array() : new Float32Array();
  }

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
