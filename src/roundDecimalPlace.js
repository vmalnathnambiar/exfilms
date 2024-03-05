/**
 * Round values to a specific decimal place.
 * @param {number} toRoundValue The number value you want to round.
 * @param {number} decimalPlace The number of decimal places you would like to round to.
 * @returns {Promise<number>} A promise that resolves with the rounded value to the specified number of decimal places.
 */
export async function roundDecimalPlace(toRoundValue, decimalPlace) {
  const factor = 10 ** decimalPlace;
  return Math.round(toRoundValue * factor) / factor;
}
