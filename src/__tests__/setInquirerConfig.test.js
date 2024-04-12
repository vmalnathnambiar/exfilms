import { describe, test, expect } from 'vitest';

import { setInquirerConfig } from '../utils/setInquirerConfig.js';

/**
 * To test setInquirerConfig()
 * Input: configParam (Object)
 * Output: configParam (Object)
 */
describe('setInquirerConfig', () => {
  // Dummy data
  const testConfigParam = {
    outputFormat: ['JSON'],
    msLevel: '1 2',
  };

  // Tests
  test('configure configParam appropriately', async () => {
    const configParam = await setInquirerConfig(testConfigParam);
    expect(configParam.outputFormat).toStrictEqual('JSON');
    expect(configParam.msLevel).toStrictEqual([1, 2]);
  });
});
