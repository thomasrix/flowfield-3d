'use stric'
import '../../style/canvas.scss';
import {create, select} from '../utils/trix';
import * as THREE from 'three';

export default class FirstField{
    constructor(){
        console.log('first constructed');
        this.width = 1920;
        this.height = 1920;
        this.build();
    }
    build(){
        const container = create('div', select('body'), 'canvas-container');
        const canvas = create('canvas', container, 'draw-canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        this.ctx = canvas.getContext('webgl');
        this.buildScene();
    }
    buildScene(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('hsl(180, 1%, 3%)');
        this.renderer = new THREE.WebGLRenderer({
            context:this.ctx
        });
        this.renderer.setSize(this.width, this.height);

        this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 12;
        this.camera.position.x = 0;
        this.camera.position.y = 5;
        
        this.scene.add(this.camera);

        this.renderer.render(this.scene, this.camera); 
    }
}