import Arweave from '../node_modules/arweave/web/index';
import { ApiConfig } from '../node_modules/arweave/web/lib/api';
import { fabric } from 'fabric';
import { defaultConfig } from './arweave'
import { PeerList } from '../node_modules/arweave/web/network';
var FontFaceObserver = require('fontfaceobserver');

export class ArNode {
    arweave: Arweave;
    canvasObject: fabric.Image;
    ip: string;
    textObject: fabric.Text;
    friends: PeerList | undefined;
    children: ArNode[];
    line: fabric.Line;
    parent: ArNode;

    constructor(c: fabric.Canvas, pos: fabric.Point, config?: ApiConfig | void, s?: fabric.Point, p?: ArNode) {
        this.children = [];
        if (config) {
            this.ip = config.host;
        }
        else {
            this.ip = defaultConfig.host;
        }
        fabric.Image.fromURL("../dist/img/arweave.png", (img) => {
            img.selectable = false;
            img.setPositionByOrigin(pos, 'center', 'center');
            img.on('mouseover', this.onHover.bind(this));
            img.on('mouseout', this.offHover.bind(this));
            img.on('mousedown', this.onClick.bind(this));
            //Wait for font to load
            let font = new FontFaceObserver('Titillium Web');
            font.load().then(() => {});
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
        this.arweave = Arweave.init(config || defaultConfig);
        this.arweave.network.getPeers().then((peers) => {
            this.friends = peers;
        }, (e) => {
            if (config) {
                //upgrade
                config.protocol = 'https';
                config.port = 443;
                this.arweave = Arweave.init(config);
                this.arweave.network.getPeers().then((peers) => {
                    this.friends = peers;
                    console.log('https upgrade sucessful')
                }, (e) => {
                    console.error(e);
                    this.destroy.bind(this)();
                });
            }
        });
    }

    protected onHover(ev: fabric.IEvent) {
        let text = new fabric.Text(this.ip, {
            'fontFamily': 'Titillium Web',
            'fill': 'white'
        });
        text.setPositionByOrigin(new fabric.Point(this.canvasObject.getCenterPoint().x, this.canvasObject.getCenterPoint().y - 100), 'center', 'center');
        this.canvasObject.canvas.add(text);
        this.textObject = text;
    }

    protected offHover(ev: fabric.IEvent) {
        this.textObject.canvas.remove(this.textObject);
        this.textObject = undefined;
    }

    public onClick(existingPeers: PeerList): PeerList | undefined {
        if (this.friends) {
            if (this.parent) {
                this.parent.destroyChildren(this);
            }
            let newPeers:string[] = []
            this.friends.forEach(element => {
                if (!(element in existingPeers)) {
                    newPeers.push(element);
                }
            });
            //should get this working
            let dist = 0
            newPeers.forEach(element => {
                let info = this.getPort(element);
                this.children.push(new ArNode(this.canvasObject.canvas, new fabric.Point(this.canvasObject.getCenterPoint().x + dist, this.canvasObject.getCenterPoint().y + 200), {
                    host: info[0],
                    port: info[1],
                    protocol: 'http',
                    timeout: 10000,
                    logging: false
                }, this.canvasObject.getCenterPoint(), this));
                dist += 200;
            });
        }
        return undefined;
    }

    protected getPort(ip: string): any[] {
        if (ip.search(':') === -1) {
            return [ip, 1984]
        }
        else {
            return [ip.split(':')[0], ip.split(':')[1]]
        }
    }

    public destroyChildren(save: ArNode) {
        let count = 0
        this.children.forEach(child => {
            if (child !== save){
                child.destroy();
                delete this.children[count];
            }
            count++;
        });
        //https://stackoverflow.com/a/281335/10720080
        this.children.filter(Boolean);
    }

    public destroy(): void {
        if (this.children) {
            this.children.forEach(child => {
                child.destroy();
            });
        }
        if (this.line) {
            this.canvasObject.canvas.remove(this.line);
            delete this.line;
            this.canvasObject.canvas.remove(this.canvasObject);
            delete this.canvasObject;
        }
    }
}