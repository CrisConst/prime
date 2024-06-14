import { Worker } from 'worker_threads';
import path from 'path';

const min = 2;
const max = 1e7;
const numThreads = 4;
const range = Math.ceil((max - min) / numThreads);

export function runWorker(start: number, end: number): Promise<number[]> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
            workerData: { start, end }
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

async function main() {
    const promises = [];
    for (let i = 0; i < numThreads; i++) {
        const start = min + i * range;
        const end = Math.min(start + range, max);
        promises.push(runWorker(start, end));
    }

    const results = await Promise.all(promises);
    const primes = results.flat();
    const message = "Prime is : " + primes.join(" ");
    console.log(message);
}

main().catch(err => console.error(err));
