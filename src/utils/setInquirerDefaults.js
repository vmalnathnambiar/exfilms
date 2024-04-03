/**
 * Set the configuration parameters based on Inquirer input.
 * @param {Object} configParam Configuration parameters received from the Inquirer prompts.
 * @returns {Promise<Object>} A promise that resolves with an object containing the configuration parameters in the required format for execution.
 */
export async function setInquirerDefaults(configParam) {
  // Set output format as a string instead on an array
  configParam.outputFormat = configParam.outputFormat[0];

  // Set MS level as a number array instead of a string
  if (configParam.msLevel) {
    configParam.msLevel = configParam.msLevel.split(' ').map(Number);
  }
  return configParam;
}
