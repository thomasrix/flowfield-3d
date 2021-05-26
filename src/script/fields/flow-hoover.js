'use strict'
import * as THREE from 'three';

export default class FlowHoover{
    constructor(scene, resolution, redrawCallback){
        this.scene = scene;
        this.redraw = redrawCallback;
        this.resolution = resolution;
        this.width = 10;
        this.height = 10;
        this.visible = true;
        this.redrawOnChange = false;
/*         this.parameters = {
            scale :0.75, 
            // Values for the attractor function
            a : -0.5,
            b : -0.9,
            c : -0.55,
            d : -0.5,
            e : 0.3, 
            f : 0.15
        }
 */        this.parameters = {
            scale :0.65, 
            // Values for the attractor function
            a : 1.5,
        }
        this.build();
    }
    build(){
        // console.log('build flow');
        this.initSpheres();
        // this.makeSphere(0, 0.05, 0);
        this.group = new THREE.Group();
        this.scene.add(this.group);
        // this.createCubeGrid(this.width, 7);

        
    }
    createCubeGrid(size, count){
        let dx, dy, dz;
        let startZ = size * -0.5;
        // let startZ = 0;
        let startX = size * -0.5;
        // let startX = 0;
        let startY = size * -0.5;
        // let startY = 0;

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
        this.sphereGeom = new THREE.SphereGeometry( 0.15, 16, 16 );
    
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
        const pos = new THREE.Vector3(x, y, z);
        const pull = this.getValue(x, y, z);
        // console.log('pull', pos.angleTo(pull));
        const line = new THREE.LineCurve3(new THREE.Vector3(x, y, z), pull);
        const tubeGeom = new THREE.TubeGeometry( line, 64, 0.03, 8, false );
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


        let dx = y;
        let dy = y*z -x;
        let dz = this.parameters.a - y*y;

        // let nx;
        let dx = (x - this.width / 2) * this.parameters.scale;
        // console.log('x', x, dx);
        // let ny = y + 0.4;
        let dz = (z - this.width / 2) * this.parameters.scale
        let dy = (y - this.height / 2) * this.parameters.scale;
        // console.log('dx', dx, x);
        
        
        let nx = Math.sin(this.parameters.a * dy) + this.parameters.d * Math.cos(this.parameters.a * dx);
        let ny = Math.sin(this.parameters.b * dx) + this.parameters.e * Math.cos(this.parameters.b * dz);
        let nz = Math.sin(this.parameters.c * dz) + this.parameters.f * Math.cos(this.parameters.c * dy);
        // console.log('nx', nx, x);
        // let nz = 0;

        return new THREE.Vector3( x + nx, y + ny, z + nz);
/*         return {
            x:x + (nx),
            y:y + (ny),
            z:z + (nz)
        } */
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
    showFlow(){
        this.visible = true;
        this.emptyGroup();
        this.createCubeGrid(this.width, 4);
    }
    hideFlow(){
        this.visible = false;
        this.emptyGroup();
    }
    copyFlow(){
        console.log(JSON.stringify(this.parameters));
    }
    emptyGroup(){
        for (let i = this.group.children.length - 1; i >= 0; i--) {
            this.group.remove(this.group.children[i]);
        }
    }
    redrawFlow(){
        if(this.visible){
            this.emptyGroup();
            this.createCubeGrid(this.width, 7);
        }
        if(this.redrawOnChange){
            this.redraw();
        }
    }
}