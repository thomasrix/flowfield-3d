'use strict'
import * as THREE from 'three';

export default class Flow{
    constructor(scene, resolution){
        this.scene = scene;
        this.resolution = resolution;
        this.width = 10;
        this.height = 10;
        this.parameters = {
            scale :0.5, 
            // Values for the attractor function
            a : 0.6,
            b : 0.66,
            c : 0.4,
            d : 1.2,
            e : 0, 
            f : 0
        }
        this.build();
    }
    build(){
        console.log('build flow');
        this.initSpheres();
        // this.makeSphere(0, 0.05, 0);
        this.group = new THREE.Group();
        this.scene.add(this.group);
        this.createCubeGrid(10, 7);

        
    }
    createCubeGrid(size, count){
        let dx, dy, dz;
        let startZ = size * -0.5;
        let startX = size * -0.5;
        // let startX = 0;
        let startY = 0;
        // let startY = size * -0.5;
        // let startZ = 0;

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
        // console.log(x, pull.x);
        const points = [
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(pull.x, pull.y, pull.z),
        ]
        // const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const line = new THREE.LineCurve3(new THREE.Vector3(x, y, z), new THREE.Vector3(pull.x, pull.y, pull.z));
        const tubeGeom = new THREE.TubeGeometry( line, 64, 0.01, 8, false );
        const mesh = new THREE.Mesh( tubeGeom, this.material );
        // const line = new THREE.Line( geometry );
        this.group.add( mesh );

    }
    makeSphere(x = 0, y = 0, z = 0){

        const mesh = new THREE.Mesh(this.sphereGeom, this.material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        this.group.add(mesh);
    }
    getValue(x = 0, y = 0, z = 0){
        // let nx;
        // let ny = y + 0.4;
        let dz = (z - (this.width / 2)) * this.parameters.scale
        let dx = (x - (this.width / 2)) * this.parameters.scale;
        let dy = (y - this.height / 2) * this.parameters.scale;
        // console.log('dx', dx, x);
        
        
        let nx = Math.sin(this.parameters.a * dy) + this.parameters.c * Math.cos(this.parameters.a * dx);
        let ny = Math.sin(this.parameters.b * dx) + this.parameters.d * Math.cos(this.parameters.b * dy);
        let nz = Math.sin(this.parameters.e * dz) + this.parameters.f * Math.cos(this.parameters.e * dy);
        // console.log('nx', nx, x);


        return {
            x:x + (nx * 0.5),
            y:y + (ny * 0.5),
            z:z + (nz * 0.5)
        }
/*
            // clifford attractor
    // http://paulbourke.net/fractals/clifford/
    
    // scale down values
    var scale = 0.005;
    x = (x - width / 2) * scale;
    y = (y - height / 2)  * scale;
    
    // attactor gives new x, y for old one. 
    var x1 = Math.sin(parameters.a * y) + parameters.c * Math.cos(parameters.a * x);
    var y1 = Math.sin(parameters.b * x) + parameters.d * Math.cos(parameters.b * y);
    
    // find angle from old to new. that's the value.
    return Math.atan2(y1 - y, x1 - x);*/
    }
    emptyGroup(){
        for (let i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }
    }
    redraw(){
        this.emptyGroup();
        this.createCubeGrid(10, 7);
    }
}