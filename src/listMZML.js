import { readdirSync } from 'fs';

// List mzML data files from directory
export async function listMZML(directory) {
  let files = readdirSync(directory);
  return files.filter(
    (file) => file.endsWith('.mzML') && !file.startsWith('._'),
  );
}
