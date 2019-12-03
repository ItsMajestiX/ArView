import { ArNode } from './arnode';
import { fabric } from 'fabric';
import { onExport, onDownload } from './downloads';
import { GraphGetter } from './arweave';
import { Loading } from './menu';

let arButton = document.getElementById('upload');
arButton.onclick = onExport;

//Create a canvass
let canvasElement = document.createElement('canvas');
canvasElement.id = 'canvas';
document.body.appendChild(canvasElement);

export let canvas = new fabric.Canvas('canvas');
canvas.selection = false;

let downloadButton = document.getElementById('download')
downloadButton.onclick = onDownload;

let load = new Loading();
//https://stackoverflow.com/a/3078427/10720080
function resizeHandler(ev?: UIEvent) {
    canvas.setHeight(window.innerHeight);
    canvas.setWidth(window.innerWidth);
    load.onResize(ev);
}

resizeHandler();
window.onresize = resizeHandler;

canvas.setBackgroundColor('black', canvas.renderAll.bind(canvas));

//Shamelessly copied from http://fabricjs.com/fabric-intro-part-5#pan_zoom :)
canvas.on('mouse:wheel', function (opt) {
    let cast = opt.e as WheelEvent;
    var delta = -cast.deltaY;
    var pointer = canvas.getPointer(opt.e);
    var zoom = canvas.getZoom();
    zoom = zoom + delta / 1000;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint(new fabric.Point(cast.offsetX, cast.offsetY), zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
    //Refresh
    canvas.getObjects().forEach(element => {
        element.setCoords();
    });
});

canvas.on('mouse:move', function (opt) {
    let cast = opt.e as MouseEvent;
    if (this.isDragging) {
        this.viewportTransform[4] += cast.clientX - this.lastPosX;
        this.viewportTransform[5] += cast.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = cast.clientX;
        this.lastPosY = cast.clientY;
        canvas.renderAll();
        //Refresh
        canvas.getObjects().forEach(element => {
            element.setCoords();
        });
    }
});

canvas.on('mouse:down', function (opt: fabric.IEvent) {
    let cast = opt.e as MouseEvent;
    let target = opt.target;
    if (opt.target) {
        let obj = node.findObj(target);
        obj.onClick();
        //Refresh
        canvas.getObjects().forEach(element => {
            element.setCoords();
        });
    }
    else {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = cast.clientX;
        this.lastPosY = cast.clientY;
        canvas.getObjects().forEach(element => {
            element.setCoords();
        });
    }
});

canvas.on('mouse:up', function (opt) {
    this.isDragging = false;
    this.selection = true;
});

export let version = '1.0.1';
export let graph = new GraphGetter();
export let node: ArNode;
graph.init().then(() => {
    //Set up first node
    load.destroy();
     node = new ArNode(canvas, new fabric.Point(canvas.getCenter().left, canvas.getCenter().top));
});