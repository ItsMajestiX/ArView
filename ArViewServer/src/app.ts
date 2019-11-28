import { argv } from './args';
import fs = require('fs');
import { NodeGraph } from './nodegraph';

//https://stackoverflow.com/a/49957219/10720080
async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

export async function app() {
    if (!fs.existsSync(argv.s)) {
        fs.mkdirSync(argv.s);
    }
    while (true) {
        let graph = new NodeGraph()
        await graph.create(argv.i + ':' + argv.p, argv.h);
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
        fs.writeFileSync(argv.s + '/' + 'graph' + fileID + '.json', JSON.stringify(graph));
        await sleep(argv.d * 1000);
    }
}

app();