import { Octokit } from '@octokit/core';
import { throttling } from '@octokit/plugin-throttling';
import dotenv from 'dotenv';

dotenv.config();
const MyOctokit = Octokit.plugin(throttling);

// Initialize Octokit with authentication and configuration
const octokit = new MyOctokit({
  auth: process.env.GITHUB_TOKEN,
  throttle: {
    onRateLimit: (retryAfter, options, octokit, retryCount) => {
      console.log(
        `Request quota exhausted for request ${options.method} ${options.url}`
      );
      if (retryCount < 1) {
        console.log(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    onSecondaryRateLimit: (retryAfter, options, octokit) => {
      console.warn(
        `SecondaryRateLimit detected for request ${options.method} ${options.url}`
      );
    },
  },
});

// Get file path recursively from a GitHub repository with Octokit
export async function getFilePaths(owner, repo, path = '') {
  try {
    const response = await octokit.request(
      `GET /repos/{owner}/{repo}/contents/{path}`,
      {
        owner: owner,
        repo: repo,
        path: path,
      }
    );

    let paths = [];
    for (let item of response.data) {
      if (
        item.type === 'file' &&
        (item.name.endsWith('.js') || item.name.endsWith('.ts'))
      ) {
        paths.push(item.path);
      } else if (item.type === 'dir') {
        const morePaths = await getFilePaths(owner, repo, item.path);
        paths = paths.concat(morePaths);
      }
    }
    return paths;
  } catch (error) {
    console.error('Error fetching files with Octokit:', error);
    throw error;
  }
}

// Fetch the raw content of a file from a GitHub repository
export async function getFile(owner, repo, path = '') {
  try {
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path,
        mediaType: {
          format: 'raw',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error processing file ${path} with Octokit:`, error);
    return {};
  }
}
