import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';
import P5 from 'p5';

const srandom = seedrandom('b');

let squares = [];

let tl;

let image;
let dw = 0, dh = 0;
let freq;
let minSize;
let px = [];

export default class P5Renderer implements BaseRenderer{

    recording: boolean = false;
    colors = ['#D1CDC4', '#340352', '#732A70', '#FF6EA7', '#FFE15F'];
    backgroundColor = '#FFFFFF';

    canvas: HTMLCanvasElement;
    s: any;

    completeCallback: any;
    delta = 0;
    animating = true;

    width: number = 1920 / 2;
    height: number = 1080 / 2;

    size: number;

    x: number;
    y: number;

    frameCount = 0;
    totalFrames = 1000;

    constructor(w, h) {

        this.width = w;
        this.height = h;

        const sketch = (s) => {
            this.s = s;
            s.pixelDensity(1);
            s.setup = () => this.setup(s)
            s.draw = () => this.draw(s)
        }

        new P5(sketch);
    }

    protected setup(s) {
        let renderer = s.createCanvas(this.width, this.height);
        this.canvas = renderer.canvas;
        s.background(0, 0, 0, 255);
        s.colorMode(s.HSB);

    }

    protected draw(s) {
        if (this.animating) { 
            this.frameCount += 3;

            let frameDelta = 2 * Math.PI * (this.frameCount % this.totalFrames) / this.totalFrames;

            s.colorMode(s.RGB);
            s.background(0, 0, 0, 255);
            s.colorMode(s.HSB);

            let numpoints = 100;
            let centerX = s.width / 2;
            let centerY = s.height / 2;
            let radiusX = s.width / 4;
            let radiusY = s.height / 4;
            for (let j = 0; j < numpoints; j++) {
                let angle = 2 * Math.PI * j / numpoints;

                //let rx = radiusX + Math.sin(frameDelta) * ((j % 4) * 20);
                let ry = radiusY + Math.sin(frameDelta) * ((j % 4) * 20);
                let rx = radiusX + Math.sin(frameDelta * 4) * ((j % 4) * 20);
                //let ry = radiusY + Math.sin(frameDelta * 2) * ((j % 4) * 20);
                //let x = centerX + Math.sin(angle) * rx;
                //let y = centerY + Math.cos(angle) * ry;

                let x = centerX + Math.sin(angle + frameDelta) * rx; //rotate circles
                let y = centerY + Math.cos(angle + frameDelta) * 100;

                s.circle(x, y, 3);
                //let hue = (((frameDelta + j) / numpoints) * 360) % 360;
                let hue = ((frameDelta + angle) / Math.PI) * 360 % 360; //color rotates
                s.fill(hue, 255, 255, 255);
                s.stroke(hue, 255, 255, 255);
            }

            if (this.recording) {
                if (frameDelta == 0) {
                    this.completeCallback();
                }
            }
        }
    }

    public render() {

    }

    public play() {
        this.frameCount = 0;
        this.recording = true;
        this.animating = true;
        this.s.background(0, 0, 0, 255);
    }

    public stop() {
        this.animating = false;
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    public resize() {
        this.s.resizeCanvas(window.innerWidth, window.innerHeight);
        this.s.background(0, 0, 0, 255);
    }
}