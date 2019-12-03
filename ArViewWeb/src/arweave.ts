import Arweave from "../node_modules/arweave/web/index";
import { NodeGraph } from "./nodegraph";

export let defaultConfig = {
	host: 'arweave.net',
	port: 443,
	protocol: 'https',
	timeout: 100000,
	logging: false
};

export class GraphGetter {
    graph: NodeGraph;
    public async init() {
        let arweave = Arweave.init(defaultConfig)
        let stuff = await arweave.arql({
            op: 'and',
            expr1: {
                op: 'equals',
                expr1: 'from',
                expr2: '03aQICRfLDTMXmJ9cIk9AAtZyOQYFNkpsCwD8w4o4mw'
            },
            expr2: {
                op: 'equals',
                expr1: 'User-Agent',
                expr2: 'ArViewServer/1.0.0'
            }
        });
        let data = atob((await arweave.transactions.getData(stuff[0])).toString());
        this.graph = JSON.parse(data);
    }
    public getPeers(ip: string): string[] | undefined {
        if (ip in this.graph.graph) {
            return this.graph.graph[ip]
        }
    }
}
