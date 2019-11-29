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
const node_1 = __importDefault(require("arweave/node"));
const rangeCheck = require("range_check");
class NodeGraph {
    constructor() {
        this.creationTime = Date.now();
        this.graph = {};
        this.passedNodes = [];
        this.badHosts = [];
        this.fail = 0;
    }
    create(ip, protocol) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = [];
            let arweave = undefined;
            //Make sure this node is valid.
            if (!this.checkReserved(ip) && !this.checkDupe(ip)) {
                this.passedNodes.push(ip);
                console.log(this.passedNodes.length + " nodes searched.");
                data = this.getPort(ip);
                if (!this.checkHost(data[0])) {
                    arweave = node_1.default.init({
                        host: data[0],
                        port: data[1],
                        protocol: protocol,
                        timeout: 3000
                    });
                }
            }
            //Get peers
            if (arweave) {
                let peers;
                peers = yield arweave.network.getPeers().catch((e) => __awaiter(this, void 0, void 0, function* () {
                    //Try again with HTTPS if failed
                    arweave = node_1.default.init({
                        host: data[0],
                        port: data[1],
                        protocol: 'https',
                        timeout: 3000
                    });
                    peers = yield arweave.network.getPeers().catch((e) => {
                        this.badHosts.push(data[0]);
                        this.fail += 1;
                        console.log("Error handled. " + this.fail + " errors total.");
                    });
                }));
                if (peers) {
                    //Remove reserved IPs and add to graph
                    peers = peers.filter(((e) => {
                        let data = this.getPort(e);
                        return !this.checkReserved(data[0]);
                    }).bind(this));
                    this.graph[ip] = peers;
                    //Repeat for peers
                    yield this.asyncForEach(peers, (e) => __awaiter(this, void 0, void 0, function* () {
                        yield this.create(e, 'http');
                    }));
                }
            }
            if (!ip) {
                this.elapsed = Date.now() - this.creationTime;
            }
        });
    }
    //Gets IP and port
    getPort(ip) {
        if (ip.search(':') === -1) {
            return [ip, 1984];
        }
        else {
            return [ip.split(':')[0], ip.split(':')[1]];
        }
    }
    //Checks for duplicates
    checkDupe(ip) {
        return this.passedNodes.some(e => e === ip);
    }
    //Checks for a bad host
    checkHost(ip) {
        return this.badHosts.some(e => e === ip);
    }
    //https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
    asyncForEach(array, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < array.length; index++) {
                yield callback(array[index], index, array);
            }
        });
    }
    //Checks for reserved IPs
    checkReserved(ip) {
        //https://en.wikipedia.org/wiki/IPv4#Special-use_addresses
        return rangeCheck.inRange(ip, ['0.0.0.0/8', '10.0.0.0/8', '100.64.0.0/10', '127.0.0.0/8', '172.16.0.0/12', '192.0.0.0/24', '192.0.2.0/24', '192.88.99.0/24', '192.168.0.0/16', '198.18.0.0/15', '198.51.100.0/24', '203.0.113.0/24', '224.0.0.0/4', '240.0.0.0/4', '255.255.255.255/32']);
    }
}
exports.NodeGraph = NodeGraph;
NodeGraph.version = '1.0.0';
//# sourceMappingURL=nodegraph.js.map