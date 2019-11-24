import Arweave = require('arweave/node');
import { NodeGraph } from './nodegraph';
import rangeCheck = require('range_check');
import fs = require("fs");

function foo(a: string[]) {
    a.push('a');
}

export async function app() {
    let nodeGraph = new NodeGraph();
    await nodeGraph.create();
    fs.writeFile('data.json', JSON.stringify(nodeGraph), () => { });
    console.log(JSON.stringify(nodeGraph));
}

app();