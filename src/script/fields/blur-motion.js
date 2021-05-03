'use strict';
import '../../style/canvas.scss';
import {create, select} from '../utils/trix';
export default class BlurMotion{
    constructor(){
        this.width = 1920;
        this.height = 1920;
        this.center = {
            x: this.width / 2,
            y: this.height / 2
        }
        this.blurAmount = 1.5;
        this.build();
    }
    build(){
        const container = create('div', select('body'), 'canvas-container');
        this.canvas = create('canvas', container, 'draw-canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = '#000000';

        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.globalAlpha = 0.99;


        this.blurCanvas = create('canvas', null, 'draw-canvas');
        this.blurCanvas.width = this.width;
        this.blurCanvas.height = this.height;
        this.blurCtx = this.blurCanvas.getContext('2d');
        this.blurCtx.filter = `blur(${this.blurAmount}px)`;
        

        // console.log(blurCanvas);

        // this.ctx.filter = `blur(${this.blurAmount}px)`;

        this.circles = [];
        for(let i = 0; i < 100 ; i++){
            
            this.circles[i] = {
                f:`hsl(${this.lerp(Math.random(), 10, 200)},  90%, ${this.lerp(Math.random(), 20, 80)}%)`,
                x:this.width/2,
                y:this.height/2,
                px:this.lerp(Math.random(), -6, 6),
                py:this.lerp(Math.random(), -6, 6),
                radius:20,
                update: (index)=>{
                    const c = this.circles[index];
                    const recenter = ()=>{
                        c.x = this.center.x;
                        c.y = this.center.y;
                        c.px = this.lerp(Math.random(), -6, 6);
                        c.py = this.lerp(Math.random(), -6, 6);
                    }
                    c.x += c.px;
                    c.y += c.py;
                    if(c.x > this.width) recenter();
                    if(c.x < 0) recenter();
                    if(c.y < 0) recenter();
                    if(c.y > this.height) recenter();
                },
                draw:(index)=>{
                    const c = this.circles[index];
                    this.ctx.fillStyle = c.f;
                    this.ctx.beginPath();
                    this.ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2, false);
                    this.ctx.fill();
                }
            }
        }
        this.animate();
    }
    lerp(norm, min, max) {
        return (max - min) * norm + min;
    }
    animate(){
    const render = ()=>{
            console.log('render');
            for(let c = 0 ; c < this.circles.length; c++){
                this.circles[c].update(c);
                this.circles[c].draw(c);
            }
            this.blurCtx.drawImage(this.canvas, 0, 0, this.width, this.height);
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.drawImage(this.blurCanvas, 0, 0, this.width, this.height);

            // this.blurAmount -= 0.05;
            // this.ctx.filter = `blur(${this.blurAmount}px)`;
            
            this.tic = requestAnimationFrame(render);
            if(this.tic > 1000) cancelAnimationFrame(this.tic);
        }
        render();
    }


}