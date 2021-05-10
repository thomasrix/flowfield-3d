'use strict'
import * as THREE from 'three';

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
        this.createCubeGrid(10, 10);
        
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
                    this.makeSphere(dx, dy, dz);
                }
            }
        }
    }
    initSpheres(){
        this.sphereGeom = new THREE.SphereGeometry( 0.05, 16, 16 );
    
        this.material = new THREE.MeshStandardMaterial({
            color: '#ff0000',
            metalness:0.5,
            // roughness:0.1,
            wireframe:false
        });
    }
    makeSphere(x = 0, y = 0, z = 0){

        const mesh = new THREE.Mesh(this.sphereGeom, this.material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        this.scene.add(mesh);
    }
}