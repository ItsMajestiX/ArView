"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
//CLI arguments
exports.argv = yargs_1.default
    .usage('Usage: arview-server [options]')
    .alias('b', 'min_bal')
    .nargs('b', 1)
    .describe('b', 'Minimum balance of wallet to send graph in winston.')
    .default('b', 15000000000)
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
    .choices('h', ['http', 'https'])
    .default('h', 'https')
    .alias('ig', 'ip_gateway')
    .nargs('ig', 1)
    .describe('ig', 'IP of gateway to use.')
    .default('ig', 'arweave.net')
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
    .alias('m', 'max')
    .nargs('m', 1)
    .describe('m', 'Maximum number of graphs to send. Set to 0 for no limit.')
    .default('m', 0)
    .argv;
//# sourceMappingURL=args.js.map