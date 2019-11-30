import Arweave from 'arweave/node';
import { PeerList } from 'arweave/node/network';

import rangeCheck = require('range_check');

export class NodeGraph {
    static version = '1.0.0';
    creationTime = Date.now();
    elapsed: number;
    graph = {};

    private passedNodes: string[] = [];
    private badHosts: string[] = [];
    private fail = 0;

    public async create(ip: string, protocol: string, timeout: number) {
        let data:string[] = [];
        let arweave: Arweave = undefined; 
        //Make sure this node is valid.
        if (!this.checkReserved(ip) && !this.checkDupe(ip)) {
            this.passedNodes.push(ip);
            console.log(this.passedNodes.length + " nodes searched.");
            data = this.getPort(ip);
            if (!this.checkHost(data[0])) {
                arweave = Arweave.init({
                    host: data[0],
                    port: data[1],
                    protocol: protocol,
                    timeout: timeout
                });
            }
        }
        //Get peers
        if (arweave) {
            let peers: void | PeerList;
            peers = await arweave.network.getPeers().catch(async (e) => {
                //Try again with HTTPS if failed
                arweave = Arweave.init({
                    host: data[0],
                    port: data[1],
                    protocol: 'https',
                    timeout: timeout
                });
                peers = await arweave.network.getPeers().catch((e) => {
                    this.badHosts.push(data[0]);
                    this.fail += 1;
                    console.log("Error handled. " + this.fail + " errors total.");
                });
            });
            if (peers) {
                //Remove reserved IPs and add to graph
                peers = peers.filter(((e) => {
                    let data = this.getPort(e);
                    return !this.checkReserved(data[0])
                }).bind(this));
                this.graph[ip] = peers;
                //Repeat for peers
                await this.asyncForEach(peers, async (e) => {
                    await this.create(e, 'http', timeout);
                });
            }
        }
        if (!ip) {
            this.elapsed = Date.now() - this.creationTime;
        }
    }

    //Gets IP and port
    private getPort(ip: string): any[] {
        if (ip.search(':') === -1) {
            return [ip, 1984];
        }
        else {
            return [ip.split(':')[0], ip.split(':')[1]];
        }
    }

    //Checks for duplicates
    private checkDupe(ip: string): boolean {
        return this.passedNodes.some(e => e === ip);
    }

    //Checks for a bad host
    private checkHost(ip: string): boolean {
        return this.badHosts.some(e => e === ip);
    }

    //https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
    private async asyncForEach(array: string[], callback: (e: string, i: number, a: string[]) => any) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    //Checks for reserved IPs
    private checkReserved(ip: string): boolean {
        //https://en.wikipedia.org/wiki/IPv4#Special-use_addresses
        return rangeCheck.inRange(ip, ['0.0.0.0/8', '10.0.0.0/8', '100.64.0.0/10', '127.0.0.0/8', '172.16.0.0/12', '192.0.0.0/24', '192.0.2.0/24', '192.88.99.0/24', '192.168.0.0/16', '198.18.0.0/15', '198.51.100.0/24', '203.0.113.0/24', '224.0.0.0/4', '240.0.0.0/4', '255.255.255.255/32']);
    }
}