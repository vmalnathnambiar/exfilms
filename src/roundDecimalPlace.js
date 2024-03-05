/**
 * Round values to a specific decimal place.
 * @param {number} toRoundValue The number value you want to round.
 * @param {number} decimalPlace The number of decimal places you would like to round to.
 * @returns {Promise<number>} A promise that resolves with the rounded value to the specified number of decimal places.
 */
export async function roundDecimalPlace(toRoundValue, decimalPlace) {
  // Perform argument type check
  if (typeof toRoundValue !== 'number') {
    throw new Error('\nInvalid argument: toRoundValue must be type Number');
  } else if (typeof decimalPlace !== 'number') {
    throw new Error('\nInvalid argument: decimalPlace must be type Number');
  }

  const factor = 10 ** decimalPlace;
  return Math.round(toRoundValue * factor) / factor;
}
