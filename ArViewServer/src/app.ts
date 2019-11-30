import { argv } from './args';
import fs = require('fs');
import { NodeGraph } from './nodegraph';
import Arweave = require('arweave/node');
import path = require('path');
import { createKey, loadKey, sendGraph } from './arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';

//https://stackoverflow.com/a/49957219/10720080
async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

export async function app() {
    let arweave = Arweave.init({
        host: argv.ig,
        port: 443,
        protocol: 'https',
        timeout: argv.tg,
        logging: true
    });
    //Test gateway connection
    await arweave.network.getInfo().catch((e) => {
        console.error("Error connecting to gateway. " + e);
        process.exit(1);
    });
    //Check if save folder exists.
    if (!fs.existsSync(argv.s)) {
        fs.mkdirSync(argv.s);
    }
    //Load wallet.
    let key: JWKInterface;
    if (!(path.extname(argv.k) === '.json' && fs.existsSync(argv.k)) && !fs.existsSync(argv.k + '/' + 'wallet.json')) {
        if (path.extname(argv.k) === '.json') {
            key = await createKey(argv.k, arweave);
        }
        else {
            key = await createKey(argv.k + '/' + 'wallet.json', arweave);
        }
    }
    else {
        if(path.extname(argv.k) === '.json') {
            key = loadKey(argv.k);
        }
        else {
            key = loadKey(argv.k + '/' + 'wallet.json');
        }
    }
    console.log('Submitting with address ' + await arweave.wallets.jwkToAddress(key));
    //Check if path is to directory or file
    //Main loop
    let count = 0;
    while (argv.m === 0 || count < argv.m) {
        count += 1;
        let paid = false;
        console.log("Waiting for payment...")
        while (!paid) {
            if (parseInt(await arweave.wallets.getBalance(await arweave.wallets.jwkToAddress(key)), 10) >= argv.b) {
                paid = true;
            }
            else {
                await sleep(argv.r * 1000);
            }
        }
        console.log("Payment acquired.")
        //Create a new graph
        let graph = new NodeGraph()
        await graph.create(argv.i + ':' + argv.p, argv.h, argv.t);
        //Write to disk
        let found = false;
        let fileID = 0;
        while (!found) {
            if (fs.existsSync(argv.s + '/' + 'graph' + fileID + '.json')) {
                fileID += 1;
            }
            else {
                found = true;
            }
        }
        let stringGraph = JSON.stringify(graph)
        fs.writeFileSync(argv.s + '/' + 'graph' + fileID + '.json', stringGraph);
        await sendGraph(stringGraph, arweave, key);
        //Sleep
        await sleep(argv.d * 1000);
    }
    console.log("Graph limit reached. Exiting.")
    process.exit(0);
}

app();