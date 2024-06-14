import { expect } from 'chai';
import { Worker } from 'worker_threads';
import path from 'path';
import { runWorker } from '../dist/src/main';

describe('Prime Number Generation', () => {

    it('should generate primes correctly in the worker thread', (done) => {
        const worker = new Worker(path.resolve(__dirname, '../dist/src/worker.js'), {
            workerData: { start: 2, end: 20 }
        });

        worker.on('message', (primes: number[]) => {
            expect(primes).to.deep.equal([2, 3, 5, 7, 11, 13, 17, 19]);
            done();
        });

        worker.on('error', done);
        worker.on('exit', (code) => {
            if (code !== 0) done(new Error(`Worker stopped with exit code ${code}`));
        });
    });

    it('should aggregate results from multiple worker threads', async () => {
        const min = 2;
        const max = 50;
        const numThreads = 4;
        const range = Math.ceil((max - min) / numThreads);

        const promises = [];
        for (let i = 0; i < numThreads; i++) {
            const start = min + i * range;
            const end = Math.min(start + range, max);
            promises.push(runWorker(start, end));
        }

        const results = await Promise.all(promises);
        const primes = results.flat();

        expect(primes).to.include.members([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]);
    });
});
