import { readdirSync } from 'fs';

/**
 * Read and list out mzML files contained within a directory.
 * @param {string} directory Directory path containing mzML files.
 * @returns {Promise<string[]>} A promise that resolves with an array of mzML file names.
 * @throws {Error} Throws error if listMZML() encounters issues in its process.
 */
export async function listMZML(directory) {
  // Check input type
  if (typeof directory !== 'string') {
    throw new Error('listMZML(): directory must be of type string');
  }

  // Filter for and return mzML filenames from directory
  const files = readdirSync(directory);
  return files.filter(
    (file) => file.endsWith('.mzML') && !file.startsWith('._'),
  );
}
