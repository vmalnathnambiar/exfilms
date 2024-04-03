import { describe, test, expect } from 'vitest';

import { keyMap, valueMap } from '../utils/cvParamMap.js';

/**
 * To test cvParamMap export
 * Input: NA
 * Output: NA
 */
describe('cvParamMap', () => {
  // Tests
  test('keyMap export', () => {
    expect(keyMap['ms level']).toStrictEqual('msLevel');
    expect(keyMap['MS1 spectrum']).toStrictEqual('scanType');
    expect(keyMap['MSn spectrum']).toStrictEqual('scanType');
    expect(keyMap['positive scan']).toStrictEqual('polarity');
    expect(keyMap['negative scan']).toStrictEqual('polarity');
    expect(keyMap['base peak intensity']).toStrictEqual('basePeakIntensity');
    expect(keyMap['total ion current']).toStrictEqual('totalIonCurrent');
    expect(keyMap['profile spectrum']).toStrictEqual('type');
    expect(keyMap['centroid spectrum']).toStrictEqual('type');
    expect(keyMap['base peak m/z']).toStrictEqual('basePeakMZ');
    expect(keyMap['scan start time']).toStrictEqual('retentionTime');
    expect(keyMap['preset scan configuration']).toStrictEqual(
      'scanPresetConfiguration',
    );
    expect(keyMap['scan window lower limit']).toStrictEqual(
      'scanWindowLowerLimit',
    );
    expect(keyMap['scan window upper limit']).toStrictEqual(
      'scanWindowUpperLimit',
    );
    expect(keyMap['isolation window target m/z']).toStrictEqual(
      'isolationWindowTarget',
    );
    expect(keyMap['isolation window lower offset']).toStrictEqual(
      'isolationWindowLowerOffset',
    );
    expect(keyMap['isolation window upper offset']).toStrictEqual(
      'isolationWindowUpperOffset',
    );
    expect(keyMap['selected ion m/z']).toStrictEqual('selectedIonMZ');
    expect(keyMap['collision energy']).toStrictEqual('collisionEnergy');
    expect(keyMap['beam-type collision-induced dissociation']).toStrictEqual(
      'collisionType',
    );
    expect(keyMap['in-source collision-induced dissociation']).toStrictEqual(
      'collisionType',
    );
    expect(keyMap['collision-induced dissociation']).toStrictEqual(
      'collisionType',
    );
    expect(keyMap['m/z array']).toStrictEqual('mzArray');
    expect(keyMap['intensity array']).toStrictEqual('intensityArray');
    expect(keyMap['time array']).toStrictEqual('timeArray');
    expect(keyMap['64-bit float']).toStrictEqual('precision');
    expect(keyMap['32-bit float']).toStrictEqual('precision');
    expect(keyMap['64-bit integer']).toStrictEqual('precision');
    expect(keyMap['32-bit integer']).toStrictEqual('precision');
    expect(keyMap['no compression']).toStrictEqual('compression');
    expect(keyMap['zlib compression']).toStrictEqual('compression');
    expect(keyMap['total ion current chromatogram']).toStrictEqual('type');
    expect(keyMap['basepeak chromatogram']).toStrictEqual('type');
    expect(keyMap['selected reaction monitoring chromatogram']).toStrictEqual(
      'type',
    );
    expect(keyMap.MS_dwell_time).toStrictEqual('dwellTime');
    expect(keyMap['non-standard data array']).toStrictEqual('msLevelArray');
  });

  test('valueMap export', () => {
    expect(valueMap['MS1 spectrum']).toStrictEqual('MS1');
    expect(valueMap['MSn spectrum']).toStrictEqual('MSn');
    expect(valueMap['positive scan']).toStrictEqual('positive');
    expect(valueMap['negative scan']).toStrictEqual('negative');
    expect(valueMap['profile spectrum']).toStrictEqual('profile');
    expect(valueMap['centroid spectrum']).toStrictEqual('centroid');
    expect(valueMap['beam-type collision-induced dissociation']).toStrictEqual(
      'beam-type collision-induced dissociation',
    );
    expect(valueMap['in-source collision-induced dissociation']).toStrictEqual(
      'in-source collision-induced dissociation',
    );
    expect(valueMap['collision-induced dissociation']).toStrictEqual(
      'collision-induced dissociation',
    );
    expect(valueMap['64-bit float']).toStrictEqual(64);
    expect(valueMap['32-bit float']).toStrictEqual(32);
    expect(valueMap['64-bit integer']).toStrictEqual(64);
    expect(valueMap['32-bit integer']).toStrictEqual(32);
    expect(valueMap['no compression']).toStrictEqual('none');
    expect(valueMap['zlib compression']).toStrictEqual('zlib');
    expect(valueMap['total ion current chromatogram']).toStrictEqual(
      'total ion current chromatogram',
    );
    expect(valueMap['basepeak chromatogram']).toStrictEqual(
      'base peak chromatogram',
    );
    expect(valueMap['selected reaction monitoring chromatogram']).toStrictEqual(
      'selected reaction monitoring chromatogram',
    );
  });
});
