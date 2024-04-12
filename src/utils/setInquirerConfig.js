/**
 * Set the configuration parameters received via Inquirer appropriately for execution.
 * @param {Object} configParam Configuration parameters.
 * @returns {Promise<Object>} A promise that resolves with updated configuration parameters in the required format for execution.
 */
export async function setInquirerConfig(configParam) {
  // Set output format as a string instead on an array
  configParam.outputFormat = configParam.outputFormat[0];

  // Set MS level as a number array instead of a string
  if (configParam.msLevel) {
    configParam.msLevel = configParam.msLevel.split(' ').map(Number);
  }

  return configParam;
}
