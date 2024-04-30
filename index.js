import { getFilePaths, getFile } from './src/api.js';

// Count the frequency of each letter in files
async function countLetters(paths, owner, repo) {
  let letterCount = {};
  let processed = 0;

  // Processes a single file to count letter frequencies.
  const processFile = async (path, index, total) => {
    try {
      console.log(`Starting download for file ${index + 1}/${total}: ${path}`);
      const file = await getFile(owner, repo, path);
      const text = file.replace(/[^a-zA-Z]/g, '').toLowerCase();
      const localCount = {};
      for (let char of text) {
        if (/[a-z]/.test(char)) {
          localCount[char] = (localCount[char] || 0) + 1;
        }
      }
      console.log(
        `Completed download for file ${++processed}/${total}: ${path}`
      );
      return localCount;
    } catch (error) {
      console.error(`Error processing file ${path} with Octokit:`, error);
      return {};
    }
  };

  const results = await Promise.all(
    paths.map((path, index) => processFile(path, index, paths.length))
  );

  // Combine results from all files into a single letterCount object.
  results.forEach((count) => {
    Object.entries(count).forEach(([char, num]) => {
      if (!letterCount[char]) {
        letterCount[char] = 0;
      }
      letterCount[char] += num;
    });
  });

  // Sort letters by frequency in descending order.
  return Object.entries(letterCount).sort((a, b) => b[1] - a[1]);
}

async function main() {
  const owner = 'lodash';
  const repo = 'lodash';
  const path = '';
  try {
    const paths = await getFilePaths(owner, repo, path);
    const results = await countLetters(paths, owner, repo);
    console.log(results);
  } catch (error) {
    console.error('Failed to execute main function:', error);
  }
}

main();
