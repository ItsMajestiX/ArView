import { ApiConfig } from '../node_modules/arweave/web/lib/api';
import { fabric } from 'fabric';
import { defaultConfig, GraphGetter } from './arweave';
import { PeerList } from '../node_modules/arweave/web/network';
import { graph } from './index';
var FontFaceObserver = require('fontfaceobserver');

export class ArNode {
    canvasObject: fabric.Image;
    ip: string;
    textObject: fabric.Text;
    friends: PeerList | undefined;
    exclusiveFriends: PeerList | undefined;
    children: ArNode[];
    line: fabric.Line;
    parent: ArNode;
    destroyed: boolean;
    config: ApiConfig;

    constructor(c: fabric.Canvas, pos: fabric.Point, config?: ApiConfig | void, s?: fabric.Point, p?: ArNode) {
        this.exclusiveFriends = [];
        this.children = [];
        this.friends = [];
        if (!config) {
            config = defaultConfig;
        }
        this.config = config;
        this.ip = config.host + ':' + config.port;
        let peers = graph.getPeers(config.host + ':' + config.port);
        this.friends = peers;
        this.initImage(pos, c, p, s);
    }

    private initImage(pos: fabric.Point, c: fabric.Canvas, p: ArNode, s: fabric.Point): void {
        if (!this.destroyed) {
            fabric.Image.fromURL("img/arweave.png", (img) => {
                img.selectable = false;
                img.setPositionByOrigin(pos, 'center', 'center');
                img.on('mouseover', this.onHover.bind(this));
                img.on('mouseout', this.offHover.bind(this));
                //Wait for font to load
                let font = new FontFaceObserver('Titillium Web');
                font.load().then(() => {
                    c.add(img);
                    this.canvasObject = img;
                    if (p) {
                        this.parent = p;
                        let line = new fabric.Line([s.x, s.y, this.canvasObject.getCenterPoint().x, this.canvasObject.getCenterPoint().y], {
                            "fill": '#' + Math.round(Math.random() * 16777215).toString(16),
                            "stroke": '#' + Math.round(Math.random() * 16777215).toString(16),
                            "strokeWidth": 5,
                            "selectable": false
                        });
                        this.canvasObject.canvas.add(line);
                        line.sendToBack();
                        this.line = line;
                    }
                });
            });
        }
    }

    public onHover(ev: fabric.IEvent) {
        if (!this.textObject) {
            let text = new fabric.Text(this.ip, {
                'fontFamily': 'Titillium Web',
                'fill': 'white'
            });
            text.setPositionByOrigin(new fabric.Point(this.canvasObject.getCenterPoint().x, this.canvasObject.getCenterPoint().y - 100), 'center', 'center');
            this.canvasObject.canvas.add(text);
            this.textObject = text;
        }
    }

    public offHover(ev: fabric.IEvent) {
        if (this.textObject) {
            this.textObject.canvas.remove(this.textObject);
            this.textObject = undefined;
        }
    }

    public onClick() {
        if (this.friends) {
            if (this.parent) {
                this.parent.destroyChildren(this);
            }
            if (this.exclusiveFriends.length === 0) {
                this.friends.forEach(element => {
                    let existingPeers = this.getUsed();
                    if (!(existingPeers.includes(element))) {
                        this.exclusiveFriends.push(element);
                    }
                });
            }
            //terminal stupidity
            let dist = -200 * (this.exclusiveFriends.length / 2);
            this.exclusiveFriends.forEach(element => {
                let info = this.getPort(element);
                this.children.push(new ArNode(this.canvasObject.canvas, new fabric.Point(this.canvasObject.getCenterPoint().x + dist, this.canvasObject.getCenterPoint().y + 200), {
                    host: info[0],
                    port: info[1],
                    protocol: 'http',
                    timeout: 3000,
                    logging: false
                }, this.canvasObject.getCenterPoint(), this));
                dist += 200;
            });
            return this.exclusiveFriends;
        }
        return undefined;
    }

    protected getPort(ip: string): any[] {
        if (ip.search(':') === -1) {
            return [ip, 1984];
        }
        else {
            return [ip.split(':')[0], ip.split(':')[1]];
        }
    }

    public destroyChildren(save: ArNode) {
        let count = 0;
        this.children.forEach(child => {
            if (child !== save){
                child.destroy();
                delete this.children[count];
            }
            count++
        });
        //https://stackoverflow.com/a/281335/10720080
        this.children.filter(Boolean);
    }

    public destroy(): void {
        this.destroyed = true;
        if (this.children) {
            this.destroyChildren(undefined);
        }
        if (this.line) {
            this.canvasObject.canvas.remove(this.line);
            delete this.line;
            this.canvasObject.canvas.remove(this.canvasObject);
            delete this.canvasObject;
        }
    }

    public findObj(obj: fabric.Object): ArNode {
        if (this.canvasObject === obj || this.line === obj || this.textObject === obj) {
            return this;
        }
        if (this.children) {
            let found:ArNode;
            this.children.forEach(child => {
                let result = child.findObj(obj);
                if (result) {
                    found = result;
                }
            });
            return found;
        }
    }

    public getUsed(list: string[] = []): string[] {
        if (this.parent) {
            list = this.parent.getUsed();
        }
        list.push(this.config.host + ':' + this.config.port);
        return list;
    }
}