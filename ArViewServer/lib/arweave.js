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
const fs = require("fs");
const nodegraph_1 = require("./nodegraph");
function createKey(path, ar) {
    return __awaiter(this, void 0, void 0, function* () {
        //Create and save
        let key = yield ar.wallets.generate();
        fs.writeFileSync(path, JSON.stringify(key));
        return key;
    });
}
exports.createKey = createKey;
//From ArViewWeb: Function to make sure key is a key
//https://stackoverflow.com/a/40718205/10720080
function isJWK(pet) {
    //Uncommon name
    return pet.kty !== undefined;
}
function loadKey(path) {
    let data = fs.readFileSync(path);
    let key = JSON.parse(data.toString());
    if (isJWK(key)) {
        return key;
    }
}
exports.loadKey = loadKey;
function sendGraph(data, ar, key) {
    return __awaiter(this, void 0, void 0, function* () {
        let transaction = yield ar.createTransaction({
            data: data
        }, key);
        transaction.addTag('Content-Type', 'application/json');
        transaction.addTag('User-Agent', 'ArViewServer/' + nodegraph_1.NodeGraph.version);
        yield ar.transactions.sign(transaction, key);
        let response = yield ar.transactions.post(transaction);
        if (response.status === 200) {
            console.log("Transaction successful. Transaction ID: " + transaction.id);
        }
        else {
            console.error("Transaction failed. Stopping.");
            process.exit(1);
        }
    });
}
exports.sendGraph = sendGraph;
//# sourceMappingURL=arweave.js.map