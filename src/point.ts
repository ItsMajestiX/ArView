import { Canvas, Object } from "fabric/fabric-impl";

export class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    toCanvas(c: Canvas): Point {
        let center = c.getCenter();
        return new Point(center.left + this.x, center.top - this.y);
    }
}