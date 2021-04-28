'use stric'
import '../../style/canvas.scss';
import {create, select} from '../utils/trix';
export default class FirstField{
    constructor(){
        console.log('first constructed');
        this.build();
    }
    build(){
        const container = create('div', select('body'), 'canvas-container');
        const canvas = create('canvas', container, 'draw-canvas');
        canvas.width = 1920;
        canvas.height = 1920;
    }
}