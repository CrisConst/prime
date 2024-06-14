import { parentPort, workerData } from 'worker_threads';

function generatePrimes(start: number, end: number): number[] {
    const primes: number[] = [];
    for (let i = start; i < end; i++) {
        let isPrime = true;
        for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(i);
        }
    }
    return primes;
}

const { start, end } = workerData;
const primes = generatePrimes(start, end);
parentPort?.postMessage(primes);
