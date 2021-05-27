'use strict'
import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';
import {lerp} from '../utils/trix';

export default class FlowTube{
    constructor(scene, flow, position, material, tubeSteps = 300, useLine = true){
        this.scene = scene;
        this.flow = flow;
        this.numberOfSteps = tubeSteps;
        this.startPos = position;
        this.material = material;
        this.useLine = useLine;
        this.build();
    }
    build(){
        this.pointPosition = new THREE.Vector3(this.startPos.x, this.startPos.y, this.startPos.z);
        this.speed = new THREE.Vector3(0, 0, 0);
        this.tubeGroup = new THREE.Group();
        this.scene.add(this.tubeGroup);
        this.makePath();
        if(this.useLine){
            this.drawLine();
        }else{
            this.drawTube();
        }
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
            // console.log(diff.length());
            // diff.setLength(0.01);
            // this.speed.add(diff.multiplyScalar(0.15));
            this.speed.addScaledVector(diff, 0.075);
            this.pointPosition.add(this.speed);
            this.speed.multiplyScalar(0.75);

            // this.speed.add(new THREE.Vector3(flowValue.x, flowValue.y, flowValue.z).multiplyScalar(0.05));
            // this.speed.add(new THREE.Vector3(flowValue.x, flowValue.y, flowValue.z));
        }
        // console.log(points);
        this.curve = new THREE.CatmullRomCurve3( points, false, 'catmullrom', 0.25);
        
    }
    drawLine(){
        const points = this.curve.getPoints( this.numberOfSteps );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        
        const material = new THREE.LineBasicMaterial( { color : 0xccccff } );
        
        // Create the final object to add to the scene
        const curveObject = new THREE.Line( geometry, material );
        // curveObject.scale.set(0.2, 0.2, 0.2);
        // curveObject.position.set(0, 2, 0);
        this.scene.add(curveObject);        
    }
    drawTube(){

        const diameter = lerp(Math.random(), 0.0, 0.05);
        const geometry = new THREE.TubeGeometry( this.curve, this.numberOfSteps * 8, diameter, 8, false );
        // const material = new THREE.MeshBasicMaterial( { color: 0x992233 } );
        const mesh = new THREE.Mesh( geometry, this.material );
        // mesh.scale.set(0.2, 0.2, 0.2);
        this.tubeGroup.add(mesh);
        this.addStart(geometry);
        this.addEnd(geometry);
    }
    addStart(geometry){
        const pos = geometry.attributes.position;
        const startPoints = [];
        startPoints.push(this.curve.getPoint(0));
        for(let i = 0; i <= geometry.parameters.radialSegments; i++){
            startPoints.push(new THREE.Vector3().fromBufferAttribute(pos, i));
        }
        
        const pointsStartGeom = new THREE.BufferGeometry().setFromPoints(startPoints);
        const psgPos = pointsStartGeom.attributes.position;
        const indexStart = [];
        for (let i = 1; i < psgPos.count - 1; i++){
            indexStart.push(0, i, i+1);
        }
        pointsStartGeom.setIndex(indexStart);
        pointsStartGeom.computeVertexNormals();
        const shapeStart = new THREE.Mesh( pointsStartGeom, this.material);
        this.tubeGroup.add(shapeStart);   
          
    }
    addEnd(geometry){
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

        const shapeEnd = new THREE.Mesh( pointsEndGeom, this.material);
        this.tubeGroup.add(shapeEnd);

    }
    
}