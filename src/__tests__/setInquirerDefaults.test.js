import { describe, test, expect } from 'vitest';

import { setInquirerDefaults } from '../utils/setInquirerDefaults';

/**
 * To test setInquirerDefaults()
 * Input: configParam (Object)
 * Output: configParam (Object)
 */
describe('setInquirerDefaults', () => {
  // Dummy data
  const testConfigParam = {
    outputFormat: ['JSON'],
    msLevel: '1 2',
  };

  // Tests
  test('configure configParam appropriately', async () => {
    const configParam = await setInquirerDefaults(testConfigParam);

    expect(configParam.outputFormat).toStrictEqual('JSON');
    expect(configParam.msLevel).toStrictEqual([1, 2]);
  });
});
