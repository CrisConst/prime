"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const main_1 = require("../dist/src/main");
describe('Prime Number Generation', () => {
    it('should generate primes correctly in the worker thread', (done) => {
        const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, '../dist/src/worker.js'), {
            workerData: { start: 2, end: 20 }
        });
        worker.on('message', (primes) => {
            (0, chai_1.expect)(primes).to.deep.equal([2, 3, 5, 7, 11, 13, 17, 19]);
            done();
        });
        worker.on('error', done);
        worker.on('exit', (code) => {
            if (code !== 0)
                done(new Error(`Worker stopped with exit code ${code}`));
        });
    });
    it('should aggregate results from multiple worker threads', () => __awaiter(void 0, void 0, void 0, function* () {
        const min = 2;
        const max = 50;
        const numThreads = 4;
        const range = Math.ceil((max - min) / numThreads);
        const promises = [];
        for (let i = 0; i < numThreads; i++) {
            const start = min + i * range;
            const end = Math.min(start + range, max);
            promises.push((0, main_1.runWorker)(start, end));
        }
        const results = yield Promise.all(promises);
        const primes = results.flat();
        (0, chai_1.expect)(primes).to.include.members([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]);
    }));
});
//# sourceMappingURL=primeGeneration.test.js.map