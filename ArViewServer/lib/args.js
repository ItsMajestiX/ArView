"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
exports.argv = yargs_1.default
    .usage('Usage: arview-server [options]')
    .alias('b', 'min_bal')
    .nargs('b', 1)
    .describe('b', 'Minimum balance of wallet to send graph.')
    .default('b', 0.015)
    .alias('d', 'delay')
    .nargs('d', 1)
    .describe('d', 'Time to wait in seconds before creating a new graph.')
    .default('d', 21600)
    .alias('i', 'ip')
    .nargs('i', 1)
    .describe('i', 'IP of node to start graph from.')
    .default('i', 'arweave.net')
    .alias('p', 'port')
    .nargs('p', 1)
    .describe('p', 'Port of node to start graph from.')
    .default('p', 443)
    .alias('h', 'protocol')
    .nargs('h', 1)
    .describe('h', 'Protocol of node to start graph from.')
    .default('h', 'https')
    .choices('h', ['http', 'https'])
    .alias('k', 'key')
    .nargs('k', 1)
    .describe('k', 'Path to key file.')
    .default('k', '.')
    .alias('s', 'save')
    .nargs('s', 1)
    .describe('s', 'Path to save finished graphs to.')
    .default('s', 'graphs')
    .alias('r', 'refresh')
    .nargs('r', 1)
    .describe('r', 'Seconds to wait before checking balance again.')
    .default('r', 30)
    .options({
    b: { type: 'number' },
    d: { type: 'number' },
    i: { type: 'string' },
    p: { type: 'number' },
    h: { choices: ['http', 'https'] },
    k: { type: 'string' },
    s: { type: 'string' },
    r: { type: 'number' }
})
    .argv;
//# sourceMappingURL=args.js.map