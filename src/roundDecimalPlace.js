// Round value to a specific decimal place
export async function roundDecimalPlace(number, decimalPlace) {
  const factor = 10 ** decimalPlace;
  return Math.round(number * factor) / factor;
}
