// @ts-nocheck

import { describe, test, expect } from 'vitest';

import { decodeBinary } from '../decodeBinary.js';
import { encodeBinary } from '../encodeBinary.js';

/**
 * To test decodeBinary function
 * Input: precisionValue (number), compressionMethod (string), binaryData (string)
 * Output: Decoded binary data (number[])
 */
describe('binaryDecoder', () => {
  // Dummy data
  const testMZ = [
    70.0647, 90.7658, 110.0704, 116.0494, 116.0714, 158.9637, 165.09, 171.0546,
    175.1197, 188.0705, 226.951, 232.1081, 237.1005, 239.6082, 244.108,
    246.0877, 248.115, 249.0909, 260.1036, 264.1091, 274.1174, 276.0975,
    280.1055, 286.1185, 288.1334, 290.1126, 291.0659, 292.0744, 292.1335,
    294.1479, 294.9379, 295.0755, 295.124, 296.0693, 296.0828, 302.1138,
    302.1493, 303.1084, 304.0938, 306.0912, 309.1025, 309.1163, 309.166,
    317.1243, 318.1097, 320.1076, 324.1223, 324.1364, 326.1191, 326.1248,
    332.1235, 335.1362, 336.1348, 340.1412, 345.1658, 346.15, 346.1617,
    351.1685, 352.1288, 355.1745, 362.1565, 362.9252, 375.1462, 388.1759,
    430.9147, 473.1919, 478.211, 487.2082, 498.8997, 501.2427, 566.8877,
    634.8755, 702.8645, 770.8527, 838.8367, 906.8243, 974.8154, 1042.8006,
    1110.788, 1178.7754, 1246.7628, 1314.7503, 1382.7377, 1450.7251, 1518.7125,
  ];
  const testIntensity = [
    0, 0, 92, 0, 120, 0, 0, 370, 0, 190, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30,
    46, 0, 0, 20, 0, 0, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 66, 0, 0, 0, 0, 0, 0, 28, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  const encoding = {
    precisionValue: 64,
    compressionMethod: 'none',
  };

  // Tests
  test('throw error: decodeBinary() input type check', async () => {
    // precisionValue
    await expect(
      decodeBinary(
        encoding.precisionValue.toString(),
        encoding.compressionMethod,
        testMZ,
      ),
    ).rejects.toThrowError(
      '\ndecodeBinary() - precisionValue must be of type number',
    );

    await expect(
      decodeBinary(50, encoding.compressionMethod, testMZ),
    ).rejects.toThrowError(
      '\ndecodeBinary() - precisionValue defined not valid',
    );

    // compressionMethod
    await expect(
      decodeBinary(encoding.precisionValue, 0, testMZ),
    ).rejects.toThrowError(
      '\ndecodeBinary() - compressionMethod must be of type string',
    );

    await expect(
      decodeBinary(encoding.precisionValue, 'gzip', testMZ),
    ).rejects.toThrowError(
      '\ndecodeBinary() - compressionMethod defined not valid',
    );

    // encodedData
    await expect(
      decodeBinary(encoding.precisionValue, encoding.compressionMethod, 0),
    ).rejects.toThrowError(
      '\ndecodeBinary() - encodedData must be of type string',
    );
  });

  test('throw error: encodeBinary() input type check', async () => {
    // precisionValue
    await expect(
      encodeBinary(
        encoding.precisionValue.toString(),
        encoding.compressionMethod,
        testMZ,
      ),
    ).rejects.toThrowError(
      '\nencodeBinary() - precisionValue must be of type number',
    );

    await expect(
      encodeBinary(50, encoding.compressionMethod, testMZ),
    ).rejects.toThrowError(
      '\nencodeBinary() - precisionValue defined not valid',
    );

    // compressionMethod
    await expect(
      encodeBinary(encoding.precisionValue, 0, testMZ),
    ).rejects.toThrowError(
      '\nencodeBinary() - compressionMethod must be of type string',
    );

    await expect(
      encodeBinary(encoding.precisionValue, 'gzip', testMZ),
    ).rejects.toThrowError(
      '\nencodeBinary() - compressionMethod defined not valid',
    );

    // decodedData
    await expect(
      encodeBinary(
        encoding.precisionValue,
        encoding.compressionMethod,
        'hello world',
      ),
    ).rejects.toThrowError(
      '\nencodeBinary() - decodedData must be of type ArrayBufferLike, ArrayLike<number>, Iterable<number> or number',
    );
  });

  test('decode encoded data: 64-bit', async () => {
    // Without compression
    let encodedData = await encodeBinary(
      encoding.precisionValue,
      encoding.compressionMethod,
      testMZ,
    );
    expect(
      Array.from(
        await decodeBinary(
          encoding.precisionValue,
          encoding.compressionMethod,
          encodedData,
        ),
      ),
    ).toStrictEqual(testMZ);

    // With compression
    encoding.compressionMethod = 'zlib';
    encodedData = await encodeBinary(
      encoding.precisionValue,
      encoding.compressionMethod,
      testMZ,
    );
    expect(
      Array.from(
        await decodeBinary(
          encoding.precisionValue,
          encoding.compressionMethod,
          encodedData,
        ),
      ),
    ).toStrictEqual(testMZ);
  });

  test('decode encoded data: 32-bit', async () => {
    encoding.precisionValue = 32;

    // With compression
    let encodedData = await encodeBinary(
      encoding.precisionValue,
      encoding.compressionMethod,
      testIntensity,
    );
    expect(
      Array.from(
        await decodeBinary(
          encoding.precisionValue,
          encoding.compressionMethod,
          encodedData,
        ),
      ),
    ).toStrictEqual(testIntensity);

    // Without compression
    encoding.compressionMethod = 'none';
    encodedData = await encodeBinary(
      encoding.precisionValue,
      encoding.compressionMethod,
      testIntensity,
    );
    expect(
      Array.from(
        await decodeBinary(
          encoding.precisionValue,
          encoding.compressionMethod,
          encodedData,
        ),
      ),
    ).toStrictEqual(testIntensity);
  });
});
