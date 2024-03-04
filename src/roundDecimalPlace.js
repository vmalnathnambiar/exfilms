/**
 * Round values to a specific decimal place.
 * @param {number} number The number you want to round.
 * @param {number} decimalPlace The number of decimal places you would like to round to.
 * @returns {Promise<number>} A promise that resolves with the rounded value to the specified number of decimal places.
 */
export async function roundDecimalPlace(number, decimalPlace) {
  const factor = 10 ** decimalPlace;
  return Math.round(number * factor) / factor;
}
