'use strict'
import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';

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
        this.numberOfSteps = 30;
        this.makePath();
        this.drawTube();
    }
    makePath(){

        const points = [];
        for(let i = 0; i < this.numberOfSteps ; i++){
            points[i] = this.pointPosition.clone();
            const flowValue = this.flow.getValue(this.pointPosition.x, this.pointPosition.y, this.pointPosition.z);
            // const change = new THREE.Vector3((Math.random() * 0.6) -0.3, (Math.random() * 0.6) -0.3, (Math.random() * 0.6) -0.3);
            const diff = new THREE.Vector3().subVectors(new THREE.Vector3(flowValue.x, flowValue.y, flowValue.z), this.pointPosition);
            // console.log(diff);
            this.speed.add(diff.multiplyScalar(0.1));
            this.pointPosition.add(this.speed);

            // this.speed.add(new THREE.Vector3(flowValue.x, flowValue.y, flowValue.z).multiplyScalar(0.05));
            // this.speed.add(new THREE.Vector3(flowValue.x, flowValue.y, flowValue.z));
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