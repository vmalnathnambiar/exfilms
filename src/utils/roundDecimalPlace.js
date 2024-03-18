/**
 * Round values to a specific decimal place.
 * @param {number} toRoundValue The number value you want to round.
 * @param {number} decimalPlace The number of decimal places you would like to round to.
 * @returns {Promise<number>} A promise that resolves with the rounded value to the specified number of decimal places.
 * @throws {Error} Throws error if roundDecimalPlace() encounters issues in its process.
 */
export async function roundDecimalPlace(toRoundValue, decimalPlace) {
  // Check input type
  if (typeof toRoundValue !== 'number') {
    throw new Error('roundDecimalPlace(): toRoundValue must be of type number');
  } else if (isNaN(decimalPlace) || typeof decimalPlace !== 'number') {
    throw new Error('roundDecimalPlace(): decimalPlace must be of type number');
  }

  // Round value to specific number of decimal places
  const factor = 10 ** decimalPlace;
  return Math.round(toRoundValue * factor) / factor;
}
