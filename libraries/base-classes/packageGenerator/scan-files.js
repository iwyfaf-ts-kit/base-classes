import fs from 'fs';
import path from 'path';

/**
 * Recursively scans a directory and returns an object containing files grouped by their parent directories.
 * Files with specified extensions and directories can be ignored.
 *
 * @param {string} directory - The directory to scan. Can be relative or absolute.
 * @param {string[]} [ignoreExt=[]] - An array of file extensions to ignore (e.g., ['.txt', '.log']).
 * @param {string[]} [ignoreDirs=[]] - An array of directory names to ignore (e.g., ['node_modules', '.git']).
 * @returns {Object} An object where keys are parent directory names and values are arrays of file objects.
 * Each file object contains:
 * - `path`: The directory path where the file is located.
 * - `name`: The name of the file.
 *
 * @example
 * // Scan the current directory, ignoring .txt files and the 'node_modules' directory
 * const files = scanFiles('.', ['.txt'], ['node_modules']);
 * console.log(files);
 * // Output:
 * // {
 * //   'src': [
 * //     { path: 'src', name: 'index.js' },
 * //     { path: 'src', name: 'utils.js' }
 * //   ],
 * //   'tests': [
 * //     { path: 'tests', name: 'test.js' }
 * //   ]
 * // }
 */
const scanFiles = (directory, ignoreExt = [], ignoreDirs = []) => {
  const absoluteDirectory = path.resolve(directory);
  let files = {};

  fs.readdirSync(absoluteDirectory).forEach((file) => {
    const filePath = path.join(directory, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      if (ignoreDirs.includes(file)) {
        return;
      }

      const subFiles = scanFiles(filePath, ignoreExt, ignoreDirs);

      if (Object.keys(subFiles).length > 0) {
        files = Object.fromEntries(Object.entries(files).concat(Object.entries(subFiles)));
      }
    } else {
      const mainDirectory = directory.split('/').at(-1);
      const fileIncludedIgnoreExt = ignoreExt.some((ext) => file.endsWith(ext));

      if (ignoreDirs.includes(mainDirectory)) return;

      if (!Array.isArray(files[mainDirectory])) files[mainDirectory] = [];
      if (!fileIncludedIgnoreExt) {
        files[mainDirectory].push({ path: directory, name: file });
      }
    }
  });

  return files;
};

export default scanFiles;
