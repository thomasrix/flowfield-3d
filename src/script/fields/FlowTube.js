'use strict'
import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';
import {lerp} from '../utils/trix';

export default class FlowTube{
    constructor(scene, flow, position){
        this.scene = scene;
        this.flow = flow;
        this.startPos = position;
        this.build();
    }
    build(){
        this.pointPosition = new THREE.Vector3(this.startPos.x, this.startPos.y, this.startPos.z);
        this.speed = new THREE.Vector3(0, 0, 0);
        this.numberOfSteps = 70;
        this.makePath();
        this.drawTube();
    }
    makePath(){

        const points = [];
        for(let i = 0; i < this.numberOfSteps ; i++){
            points[i] = this.pointPosition.clone();
            const flowValue = this.flow.getValue(this.pointPosition.x, this.pointPosition.y, this.pointPosition.z);
            // const change = new THREE.Vector3((Math.random() * 0.6) -0.3, (Math.random() * 0.6) -0.3, (Math.random() * 0.6) -0.3);
            const diff = new THREE.Vector3().subVectors(flowValue, this.pointPosition);
            // const angle = this.pointPosition.angleTo(new THREE.Vector3(flowValue.x, flowValue.y, flowValue.z));
            // console.log('angle', angle)
            console.log(diff.length());
            // diff.setLength(0.01);
            // this.speed.add(diff.multiplyScalar(0.15));
            this.speed.addScaledVector(diff, 0.13);
            this.pointPosition.add(this.speed);
            this.speed.multiplyScalar(0.8);

            // this.speed.add(new THREE.Vector3(flowValue.x, flowValue.y, flowValue.z).multiplyScalar(0.05));
            // this.speed.add(new THREE.Vector3(flowValue.x, flowValue.y, flowValue.z));
        }
        // console.log(points);
        this.curve = new THREE.CatmullRomCurve3( points, false, 'catmullrom', 0.25);
        
    }
    drawTube(){
        const material = new THREE.MeshStandardMaterial({
            color: '#917d7d',
            metalness:0.5,
            roughness:0.1,
            wireframe:false,
            side:THREE.DoubleSide
        });
        const diameter = lerp(Math.random(), 0.005, 0.25);
        const geometry = new THREE.TubeGeometry( this.curve, 128, diameter, 8, false );
        // const material = new THREE.MeshBasicMaterial( { color: 0x992233 } );
        const mesh = new THREE.Mesh( geometry, material );
        // mesh.scale.set(0.2, 0.2, 0.2);
        this.scene.add(mesh);
    }
    
}