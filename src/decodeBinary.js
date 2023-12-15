import { decode } from 'base64-arraybuffer';
import pako from 'pako';

// Decode binary data
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
