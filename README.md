# Prime Number Generation with Node.js Worker Threads

This project generates prime numbers within a specified range using Node.js worker threads to parallelize the computation, improving performance by utilizing multi-core processors. The implementation is in TypeScript.

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Project Structure

/project-root
    /src
        main.ts
        worker.ts
        main.d.ts
    /test
        primeGeneration.test.ts
    package.json
    tsconfig.json
    README.md

## Install dependencies
npm install

## Compile typescript files
npx tsc

## Running the Prime Number generator
node dist/src/main.js

## Running tests
npm test
