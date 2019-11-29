import Arweave = require("arweave/node");
import fs = require('fs');
import { JWKInterface } from "arweave/node/lib/wallet";
import { NodeGraph } from "./nodegraph";

export async function createKey(path: string, ar: Arweave) {
    //Create and save
    let key = await ar.wallets.generate();
    fs.writeFileSync(path, JSON.stringify(key));
    return key;
}

//From ArViewWeb: Function to make sure key is a key
//https://stackoverflow.com/a/40718205/10720080
function isJWK(pet: JWKInterface): pet is JWKInterface {
    //Uncommon name
    return (<JWKInterface>pet).kty !== undefined;
}

export function loadKey(path: string): JWKInterface {
    let data = fs.readFileSync(path);
    let key = JSON.parse(data.toString());
    if (isJWK(key)) {
        return key;
    }
}

export async function sendGraph(data: string, ar: Arweave, key: JWKInterface) {
    let transaction = await ar.createTransaction({
        data: data
    }, key);
    transaction.addTag('Content-Type', 'application/json');
    transaction.addTag('User-Agent', 'ArViewServer/' + NodeGraph.version);
    await ar.transactions.sign(transaction, key);
    let response = await ar.transactions.post(transaction);
    if (response.status === 200) {
        console.log("Transaction successful. Transaction ID: " + transaction.id);
    }
    else {
        console.error("Transaction failed. Stopping.")
        process.exit(1);
    }
}