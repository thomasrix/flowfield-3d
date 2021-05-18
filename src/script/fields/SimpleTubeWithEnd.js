'use strict'
import * as THREE from 'three';
import {VertexNormalsHelper} from 'three/examples/jsm/helpers/VertexNormalsHelper';
import { Vector2, Vector3 } from 'three';

export default class SimpleTubeWithEnd{
    constructor(scene, index){
        this.scene = scene;
        this.index = index;
        this.build();
    }
    build(){
        this.pointPosition = new THREE.Vector3(this.index, 0, 0);
        this.speed = new THREE.Vector3(0, 0.5, 0);
        this.numberOfSteps = 5;
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
        const tubeGroup = new THREE.Group();
/*         const material = new THREE.MeshStandardMaterial({
            // color: '#917d7d',
            color: '#FF0000',
            metalness:0.5,
            roughness:0.1,
            wireframe:false,
            side:THREE.DoubleSide
        }); */
        const material = new THREE.MeshStandardMaterial({
            color: '#917d7d',
            // color: '#FF0000',
            metalness:0.5,
            roughness:0.1,
            wireframe:false,
            side:THREE.DoubleSide
        });
        const geometry = new THREE.TubeBufferGeometry( this.curve, 24, 0.2, 8, false );
        // const material = new THREE.MeshBasicMaterial( { color: 0x992233 } );
        const mesh = new THREE.Mesh( geometry, material );
        // mesh.scale.set(0.2, 0.2, 0.2);
        tubeGroup.add(mesh);
        this.addStart(geometry, material, tubeGroup);
        this.addEnd(geometry, material, tubeGroup);
        
        this.scene.add(tubeGroup);
    }
    addStart(geometry, material, tubeGroup){
        const pos = geometry.attributes.position;
        const startPoints = [];
        startPoints.push(this.curve.getPoint(0));
        for(let i = 0; i <= geometry.parameters.radialSegments; i++){
            startPoints.push(new THREE.Vector3().fromBufferAttribute(pos, i));
        }
        // console.log('startPoints length', startPoints.length);
        
        const pointsStartGeom = new THREE.BufferGeometry().setFromPoints(startPoints);
        const psgPos = pointsStartGeom.attributes.position;
        const indexStart = [];
        for (let i = 1; i < psgPos.count - 1; i++){
            indexStart.push(0, i, i+1);
        }
        pointsStartGeom.setIndex(indexStart);
        pointsStartGeom.computeVertexNormals();
        const shapeStart = new THREE.Mesh( pointsStartGeom, material);
        tubeGroup.add(shapeStart);   
          
    }
    addEnd(geometry, material, tubeGroup){
        const pos = geometry.attributes.position;
        const endPoints = [];
        endPoints.push(this.curve.getPoint(1));
        for (let i = (geometry.parameters.radialSegments + 1) * geometry.parameters.tubularSegments; i < pos.count; i++){
            endPoints.push(new THREE.Vector3().fromBufferAttribute(pos, i));
        }
        
        const pointsEndGeom = new THREE.BufferGeometry().setFromPoints(endPoints);
        const pegPos = pointsEndGeom.attributes.position;
        const indexEnd = [];
        for (let i = 1; i < pegPos.count - 1; i++){
            indexEnd.push(0, i+1, i);
        }
        pointsEndGeom.setIndex(indexEnd);
        pointsEndGeom.computeVertexNormals();
        // console.log(material);

        const basic = new THREE.MeshBasicMaterial({color:'red', wireframe:true, side:THREE.DoubleSide})
        const standard = new THREE.MeshStandardMaterial({color:'red', wireframe:false, side:THREE.DoubleSide})
        const shapeEnd = new THREE.Mesh( pointsEndGeom, material);
        tubeGroup.add(shapeEnd);

        // const helper = new VertexNormalsHelper( shapeEnd, 2, 0x00ff00, 1 );  
        // tubeGroup.add(helper);
    }
    
}