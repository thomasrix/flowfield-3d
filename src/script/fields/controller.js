'use strict'
import * as dat from 'dat.gui';
import {norm} from '../utils/trix';
export default class Controllers{
    constructor(){
        this.build()
    }
    build(){
        this.gui = new dat.GUI({
            useLocalStorage:true
        });
    }
    addLightController(light){
        console.log('add light');
        const color = {
            d_light:[255, 255, 0]
        }
        this.gui.addColor(color, 'd_light').onFinishChange(()=>{
            let r = norm(color.d_light[0], 0, 255);
            let g = norm(color.d_light[1], 0, 255);
            let b = norm(color.d_light[2], 0, 255);
            console.log('change color', color, r);
            light.color.setRGB(r, g, b);
        });
    }
}
