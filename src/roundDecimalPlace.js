/**
 * Round values to a specific decimal place.
 * @param {number} toRoundValue The number value you want to round.
 * @param {number} decimalPlace The number of decimal places you would like to round to.
 * @returns {Promise<number>} A promise that resolves with the rounded value to the specified number of decimal places.
 */
export async function roundDecimalPlace(toRoundValue, decimalPlace) {
  // Check input parameters
  if (typeof toRoundValue !== 'number') {
    throw new Error('\ntoRoundValue must be a number');
  } else if (typeof decimalPlace !== 'number') {
    throw new Error('\ndecimalPlace must be a number');
  }

  // Round value to specific decimal place
  const factor = 10 ** decimalPlace;
  return Math.round(toRoundValue * factor) / factor;
}
