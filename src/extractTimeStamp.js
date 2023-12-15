// Extract timestamp
export async function extractTimeStamp(timeStamp) {
  const dateMatch = timeStamp.match(/\d{4}-\d{2}-\d{2}/);
  const timeMatch = timeStamp.match(/\d{2}:\d{2}:\d{2}/);

  const date = dateMatch ? dateMatch[0] : null;
  const time = timeMatch ? timeMatch[0] : null;

  return { date, time };
}
