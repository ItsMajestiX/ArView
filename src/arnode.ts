import Arweave from '../node_modules/arweave/web/index';
import { ApiConfig } from '../node_modules/arweave/web/lib/api';
import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';
import { defaultConfig } from './arweave'
import { PeerList } from '../node_modules/arweave/web/network';
var FontFaceObserver = require('fontfaceobserver');

export class ArNode {
    scale: number;
    arweave: Arweave;
    canvasObject: fabric.Image;
    ip: string;
    textObject: fabric.Text;
    friends: PeerList | undefined;
    children: ArNode[];
    line: fabric.Line;
    parent: ArNode | ArNode;

    constructor(c: fabric.Canvas, pos: fabric.Point, scale: number, config?: ApiConfig | void, s?: fabric.Point, p?: ArNode) {
        this.children = [];
        this.scale = scale;
        if (config) {
            this.ip = config.host;
        }
        else {
            this.ip = defaultConfig.host;
        }
        this.arweave = Arweave.init(config || defaultConfig);
        this.arweave.network.getPeers().then((peers) => {
            this.friends = peers;
        }, (e) => {
            console.error(e);
        });
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
                console.log(Math.round(Math.random() * 16777215).toString(16));
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
    }

    onHover(ev: fabric.IEvent) {
        let text = new fabric.Text(this.ip, {
            'fontFamily': 'Titillium Web',
            'fill': 'white'
        });
        text.setPositionByOrigin(new fabric.Point(this.canvasObject.getCenterPoint().x, this.canvasObject.getCenterPoint().y - 100), 'center', 'center');
        this.canvasObject.canvas.add(text);
        this.textObject = text;
    }

    offHover(ev: fabric.IEvent) {
        this.textObject.canvas.remove(this.textObject);
        this.textObject = undefined;
    }

    onClick(existingPeers: PeerList): PeerList | undefined {
        this.children.push(new ArNode(this.canvasObject.canvas, new fabric.Point(this.canvasObject.getCenterPoint().x, this.canvasObject.getCenterPoint().y + 200), 1, undefined, this.canvasObject.getCenterPoint(), this));
        /*if (this.friends) {
            let newPeers:string[] = []
            this.friends.forEach(element => {
                if (!(element in existingPeers)) {
                    newPeers.push(element);
                }
            });
            let points = 0;
            newPeers.forEach(element => {
                points++;
                let node = new ArNode(this.canvasObject.canvas, new Point(, this.canvasObject.top - this.canvasObject.height), this.scale/2, {
                    host: element,
                    port: 443,
                    protocol: 'https',
                    timeout: 3000,
                    logging: false
                });
            });
        }*/
        return undefined;
    }
}