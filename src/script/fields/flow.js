'use strict'
import * as THREE from 'three';
import { NumberKeyframeTrack } from 'three';

export default class Flow{
    constructor(scene, resolution){
        this.scene = scene;
        this.resolution = resolution;
        this.build();
    }
    build(){
        console.log('build flow');
        this.initSpheres();
        // this.makeSphere(0, 0.05, 0);
        this.createCubeGrid(10, 5);
        
    }
    createCubeGrid(size, count){
        let dx, dy, dz;
        let startZ = size * -0.5;
        let startX = size * -0.5;
        let startY = 0;
        let step = size / (count - 1);
        for(let i = 0; i < count ; i++){
            dz = startZ + (step * i);
            for(let j = 0; j < count; j++){
                dx = startX + (step * j);
                for(let k = 0 ; k < count ; k++){
                    dy = startY + (step * k);
                    // console.log(dz, dx, dy);
                    this.makeMarker(dx, dy, dz);
                }
            }
        }
    }
    initSpheres(){
        this.sphereGeom = new THREE.SphereGeometry( 0.05, 16, 16 );
    
        this.material = new THREE.MeshStandardMaterial({
            color: '#999900',
            metalness:0.5,
            // roughness:0.1,
            wireframe:false,
            side:THREE.DoubleSide
        });
    }
    makeMarker(x = 0, y = 0, z = 0){
        this.makeSphere(x, y, z);
        this.makePointer(x, y, z);
    }
    makePointer(x = 0, y = 0, z = 0){
        const pull = this.getValue(x, y, z);
        console.log(x, pull.x);
        const points = [
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(pull.x, pull.y, pull.z),
        ]
        // const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const line = new THREE.LineCurve3(new THREE.Vector3(x, y, z), new THREE.Vector3(pull.x, pull.y, pull.z));
        const tubeGeom = new THREE.TubeGeometry( line, 64, 0.01, 8, false );
        const mesh = new THREE.Mesh( tubeGeom, this.material );
        // const line = new THREE.Line( geometry );
        this.scene.add( mesh );

    }
    makeSphere(x = 0, y = 0, z = 0){

        const mesh = new THREE.Mesh(this.sphereGeom, this.material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        this.scene.add(mesh);
    }
    getValue(x = 0, y = 0, z = 0){
        let nx = x + 0.2;
        let ny = y + 0.2;
        let nz = z + 0;
        return {
            x:nx,
            y:ny,
            z:nz
        }
    }
}