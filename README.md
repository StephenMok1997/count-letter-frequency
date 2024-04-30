# Count Letter Frequency

## Prerequisites

Before you start, make sure you have the following:

- Node.js (version 14.x or later recommended).
- A GitHub personal access token. Create a [personal access token on GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) following these instructions.

## Installation

To install the required dependencies, run the following command in your terminal:

```bash
npm install
```

## Configuration

Create a .env file in the root directory of your project and include your GitHub token like this:

```
GITHUB_TOKEN=your_github_access_token_here
```

## Usage

Execute the program by running:

```bash
node index.js
```

This will output the frequency of each letter from .js and .ts files in the specified repository.
