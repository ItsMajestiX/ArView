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
Object.defineProperty(exports, "__esModule", { value: true });
const args_1 = require("./args");
const fs = require("fs");
const nodegraph_1 = require("./nodegraph");
const Arweave = require("arweave/node");
const path = require("path");
const arweave_1 = require("./arweave");
//https://stackoverflow.com/a/49957219/10720080
function sleep(millis) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, millis));
    });
}
function app() {
    return __awaiter(this, void 0, void 0, function* () {
        let arweave = Arweave.init({
            host: args_1.argv.ig,
            port: 443,
            protocol: 'https',
            timeout: 3000
        });
        //Test gateway connection
        yield arweave.network.getInfo().catch((e) => {
            console.error("Error connecting to gateway. " + e);
            process.exit(1);
        });
        //Check if save folder exists.
        if (!fs.existsSync(args_1.argv.s)) {
            fs.mkdirSync(args_1.argv.s);
        }
        //Load wallet.
        let key;
        if (!(path.extname(args_1.argv.k) === '.json' && fs.existsSync(args_1.argv.k)) && !fs.existsSync(args_1.argv.k + '/' + 'wallet.json')) {
            if (path.extname(args_1.argv.k) === '.json') {
                key = yield arweave_1.createKey(args_1.argv.k, arweave);
            }
            else {
                key = yield arweave_1.createKey(args_1.argv.k + '/' + 'wallet.json', arweave);
            }
        }
        else {
            if (path.extname(args_1.argv.k) === '.json') {
                key = arweave_1.loadKey(args_1.argv.k);
            }
            else {
                key = arweave_1.loadKey(args_1.argv.k + '/' + 'wallet.json');
            }
        }
        console.log('Submitting with address ' + (yield arweave.wallets.jwkToAddress(key)));
        //Check if path is to directory or file
        //Main loop
        let count = 0;
        while (args_1.argv.m === 0 || count < args_1.argv.m) {
            count += 1;
            let paid = false;
            console.log("Waiting for payment...");
            while (!paid) {
                if (parseInt(yield arweave.wallets.getBalance(yield arweave.wallets.jwkToAddress(key)), 10) >= args_1.argv.b) {
                    paid = true;
                }
                else {
                    yield sleep(args_1.argv.r * 1000);
                }
            }
            console.log("Payment acquired.");
            //Create a new graph
            let graph = new nodegraph_1.NodeGraph();
            yield graph.create(args_1.argv.i + ':' + args_1.argv.p, args_1.argv.h);
            //Write to disk
            let found = false;
            let fileID = 0;
            while (!found) {
                if (fs.existsSync(args_1.argv.s + '/' + 'graph' + fileID + '.json')) {
                    fileID += 1;
                }
                else {
                    found = true;
                }
            }
            let stringGraph = JSON.stringify(graph);
            fs.writeFileSync(args_1.argv.s + '/' + 'graph' + fileID + '.json', stringGraph);
            yield arweave_1.sendGraph(stringGraph, arweave, key);
            //Sleep
            yield sleep(args_1.argv.d * 1000);
        }
        console.log("Graph limit reached. Exiting.");
        process.exit(0);
    });
}
exports.app = app;
app();
//# sourceMappingURL=app.js.map