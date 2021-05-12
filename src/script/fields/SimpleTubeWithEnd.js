'use strict'
import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';

export default class SimpleTube{
    constructor(scene){
        this.scene = scene;
        this.build();
    }
    build(){
        this.pointPosition = new THREE.Vector3(0, 0, 0);
        this.speed = new THREE.Vector3(0, 0.5, 0);
        this.numberOfSteps = 15;
        this.makePath();
        this.drawTube();
    }
    makePath(){

        const points = [];
        for(let i = 0; i < this.numberOfSteps ; i++){
            points[i] = this.pointPosition.clone();
            this.pointPosition.add(this.speed);
            const change = new THREE.Vector3((Math.random() * 0.6) -0.3, (Math.random() * 0.6) -0.3, (Math.random() * 0.6) -0.3);
            this.speed.add(change);
        }
        // console.log(points);
        this.curve = new THREE.CatmullRomCurve3( points, false, 'catmullrom', 0.5);
        
    }
    drawTube(){
        const material = new THREE.MeshStandardMaterial({
            color: '#917d7d',
            metalness:0.5,
            roughness:0.1,
            wireframe:false,
            side:THREE.DoubleSide
        });
        const geometry = new THREE.TubeGeometry( this.curve, 64, 0.02, 8, false );
        // const material = new THREE.MeshBasicMaterial( { color: 0x992233 } );
        const mesh = new THREE.Mesh( geometry, material );
        // mesh.scale.set(0.2, 0.2, 0.2);
        this.scene.add(mesh);
    }
    
}