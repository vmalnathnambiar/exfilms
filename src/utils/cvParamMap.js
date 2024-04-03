/* eslint-disable camelcase */

/**
 * @type {Object}
 * @description Provides a mapping between original cvParam keys and their corresponding values.
 */
const keyMap = {
  'ms level': 'msLevel',
  'MS1 spectrum': 'scanType',
  'MSn spectrum': 'scanType',
  'positive scan': 'polarity',
  'negative scan': 'polarity',
  'base peak intensity': 'basePeakIntensity',
  'total ion current': 'totalIonCurrent',
  'profile spectrum': 'type',
  'centroid spectrum': 'type',
  'base peak m/z': 'basePeakMZ',
  'scan start time': 'retentionTime',
  'preset scan configuration': 'scanPresetConfiguration',
  'scan window lower limit': 'scanWindowLowerLimit',
  'scan window upper limit': 'scanWindowUpperLimit',
  'isolation window target m/z': 'isolationWindowTarget',
  'isolation window lower offset': 'isolationWindowLowerOffset',
  'isolation window upper offset': 'isolationWindowUpperOffset',
  'selected ion m/z': 'selectedIonMZ',
  'collision energy': 'collisionEnergy',
  'beam-type collision-induced dissociation': 'collisionType',
  'in-source collision-induced dissociation': 'collisionType',
  'collision-induced dissociation': 'collisionType',
  'm/z array': 'mzArray',
  'intensity array': 'intensityArray',
  'time array': 'timeArray',
  '64-bit float': 'precision',
  '32-bit float': 'precision',
  '64-bit integer': 'precision',
  '32-bit integer': 'precision',
  'no compression': 'compression',
  'zlib compression': 'compression',
  'total ion current chromatogram': 'type',
  'basepeak chromatogram': 'type',
  'selected reaction monitoring chromatogram': 'type',
  MS_dwell_time: 'dwellTime',
  'non-standard data array': 'msLevelArray',
};

/**
 * @type {Object}
 * @description Provides a mapping between original cvParam values and their corresponding representations.
 */
const valueMap = {
  'MS1 spectrum': 'MS1',
  'MSn spectrum': 'MSn',
  'positive scan': 'positive',
  'negative scan': 'negative',
  'profile spectrum': 'profile',
  'centroid spectrum': 'centroid',
  'beam-type collision-induced dissociation':
    'beam-type collision-induced dissociation',
  'in-source collision-induced dissociation':
    'in-source collision-induced dissociation',
  'collision-induced dissociation': 'collision-induced dissociation',
  '64-bit float': 64,
  '32-bit float': 32,
  '64-bit integer': 64,
  '32-bit integer': 32,
  'no compression': 'none',
  'zlib compression': 'zlib',
  'total ion current chromatogram': 'total ion current chromatogram',
  'basepeak chromatogram': 'base peak chromatogram',
  'selected reaction monitoring chromatogram':
    'selected reaction monitoring chromatogram',
};

export { keyMap, valueMap };
