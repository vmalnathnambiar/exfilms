import { readdirSync } from 'fs';

/**
 * Read and list out mzML files contained within a directory.
 * @param {string} directory Directory path containing mzML files to be processed.
 * @returns {Promise<string[]>} A promise that resolves with an array of mzML file names to be processed.
 */
export async function listMZML(directory) {
  let files = readdirSync(directory);
  return files.filter(
    (file) => file.endsWith('.mzML') && !file.startsWith('._'),
  );
}
