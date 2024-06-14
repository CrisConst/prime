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
exports.runWorker = void 0;
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const min = 2;
const max = 1e7;
const numThreads = 4;
const range = Math.ceil((max - min) / numThreads);
function runWorker(start, end) {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, 'worker.js'), {
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
exports.runWorker = runWorker;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [];
        for (let i = 0; i < numThreads; i++) {
            const start = min + i * range;
            const end = Math.min(start + range, max);
            promises.push(runWorker(start, end));
        }
        const results = yield Promise.all(promises);
        const primes = results.flat();
        const message = "Prime is : " + primes.join(" ");
        console.log(message);
    });
}
main().catch(err => console.error(err));
//# sourceMappingURL=main.js.map