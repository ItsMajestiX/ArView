import Arweave from '../node_modules/arweave/web/index';
import { ApiConfig } from '../node_modules/arweave/web/lib/api';
import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';
import { defaultConfig } from './arweave'
import { Point } from './point'

//No ES6 :(
var FontFaceObserver = require('fontfaceobserver');

export class ArNode {
    arweave: Arweave;
    canvasObject: fabric.Image;
    ip: string;
    textObject: fabric.Text;

    constructor(c: Canvas, pos: Point, config?: ApiConfig | void) {
        if (config) {
            this.ip = config.host;
        }
        else {
            this.ip = defaultConfig.host;
        }
        this.arweave = Arweave.init(config || defaultConfig);
        fabric.Image.fromURL("../dist/img/arweave.png", (img) => {
            console.log(this);
            img.selectable = false;
            let canvPos = pos.toCanvas(c);
            img.setPositionByOrigin(new fabric.Point(canvPos.x, canvPos.y), 'center', 'center');
            img.on('mouseover', this.onHover.bind(this));
            img.on('mouseout', this.offHover.bind(this));
            //img.on('mousedown', this.click);
            //Wait for font to load
            let font = new FontFaceObserver('Titillium Web');
            font.load().then(() => {});
            c.add(img);
            this.canvasObject = img;
        });
        console.log(this);
    }

    onHover(ev: fabric.IEvent) {
        let text = new fabric.Text(this.ip, {
            'fontFamily': 'Titillium Web',
            'textBackgroundColor': 'black',
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
}