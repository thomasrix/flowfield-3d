'use stric'
import '../../style/canvas.scss';
import {create, select, lerp} from '../utils/trix';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import SimpleTubeWithEnd from './SimpleTubeWithEnd';
import Controllers from './controller';
import FlowClifford from './flow';
import FlowTube from './FlowTube';
import FlowHoover from './flow-hoover';


export default class ThirdField{
    constructor(){
        console.log('first constructed');
        this.width = 1920;
        this.height = 1920;
        this.numOfTubes = 5;
        this.tubeSteps = 300;
        this.distanceToCenter = 1.5;
        this.diameter = {min:0.001, max: 0.01};
        this.useLine = true;
        this.build();
    }
    build(){
        const container = create('div', select('body'), 'canvas-container');
        this.canvas = create('canvas', container, 'draw-canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.ctx = this.canvas.getContext('webgl');
        this.settings = new Controllers();
        this.buildScene();
    }
    buildScene(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('hsl(180, 1%, 3%)');
        this.renderer = new THREE.WebGLRenderer({
            context:this.ctx
        });
        // this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // console.log(this.renderer)
        this.renderer.setSize(this.width, this.height);
        
        
        this.addCamera();
        this.addLights();
        // this.addPlane();
        this.addFlow();
        // this.addSphere();
        // this.addLine();
        // this.addTubeWithEnd();
        this.tubes = new THREE.Group();
        this.scene.add(this.tubes);
        this.addTubes();
        this.scene.add(new THREE.GridHelper());
        
        this.controls = new OrbitControls( this.camera, this.canvas );
        this.controls.update();
        // this.controls.autoRotate = true;
        this.renderer.render(this.scene, this.camera); 
        this.boundAni = this.animate.bind(this);
        this.boundAni();
        
        this.settings.addSaveButton(this.tubes);
        const tubesSettingsFolder = this.settings.gui.addFolder('tubes');
        tubesSettingsFolder.add(this, 'removeTubes');
        tubesSettingsFolder.add(this, 'reTube');
        tubesSettingsFolder.add(this, 'useLine');
        tubesSettingsFolder.add(this, 'numOfTubes', 1, 300, 1);
        tubesSettingsFolder.add(this, 'tubeSteps', 100, 1000, 10);
        tubesSettingsFolder.add(this, 'distanceToCenter', 0, 5, 0.1);
        tubesSettingsFolder.add(this.diameter, 'min', 0.001, 0.1, 0.001);
        tubesSettingsFolder.add(this.diameter, 'max', 0.001, 0.1, 0.001);
        tubesSettingsFolder.open();
    }
    animate(){
        // console.log('animate');
        requestAnimationFrame(this.boundAni);
        this.controls.update();
        this.renderer.render(this.scene, this.camera); 
    }
    addCamera(){
        this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 30;
        this.camera.position.x = 10;
        this.camera.position.y = 8;
        
        // this.camera.lookAt(10, 10, 0);
        
        this.scene.add(this.camera);
        
    }
    addLights(){
        this.scene.add(new THREE.AmbientLight('hsl(0, 0%, 90%)'));
        let d_light = new THREE.PointLight( 0xffffff, 0.6, 0, 2);
        
        d_light.castShadow = true;
        d_light.shadow.mapSize.width = 2048; // default
        d_light.shadow.mapSize.height = 2048; // default
        d_light.shadow.camera.near = 0.5; // default
        d_light.shadow.camera.far = 500; // default
        
        console.log(d_light.color);
        d_light.position.set( 10, 15, 7 );
        
        this.settings.addLightController(d_light);
        
        this.scene.add(d_light);
        
    }
    addPlane(){
        this.planeGeom = new THREE.PlaneGeometry(10, 10, 10, 10);
        
        const material = new THREE.MeshStandardMaterial({
            color: '#666',
            metalness:0,
            roughness:0.2,
            wireframe:false,
            side:THREE.DoubleSide
        });
        
        this.plane = new THREE.Mesh(this.planeGeom, material);
        this.plane.rotateX(-Math.PI * 0.5);
        this.plane.receiveShadow = true;
        this.scene.add(this.plane);
        
        console.log(this.plane.position)
    }
    
    addFlow(){
        this.flow = new FlowHoover(this.scene, 5, this.reTube.bind(this));
        this.settings.addHooverFlowControllers(this.flow);
    }
    addTubeWithEnd(){
        const tubes = [];
        for(let i = 0 ; i < 3 ; i++){
            tubes[i] = new SimpleTubeWithEnd(this.scene, i);
        }
    }
    addTubes(){
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: '#917d7d',
            metalness:0.3,
            roughness:0.1,
            wireframe:false,
            // side:THREE.DoubleSide
        });
        const extraMaterial = new THREE.MeshStandardMaterial({
            color: '#CC0000',
            metalness:0.3,
            roughness:0.1,
            wireframe:false,
            // side:THREE.DoubleSide
        });
        // const center = this.flow.width / 2;
        const center = 0;
        


        for(let i = 0 ; i < this.numOfTubes ; i++){
            const tube = new FlowTube(
                this.tubes, 
                this.flow, 
                {
                    x:lerp(Math.random(), center - this.distanceToCenter, center + this.distanceToCenter), 
                    y:lerp(Math.random(), center - this.distanceToCenter, center + this.distanceToCenter), 
                    z:lerp(Math.random(), center - this.distanceToCenter, center + this.distanceToCenter)
                },
                baseMaterial,
                this.tubeSteps,
                this.useLine,
                this.diameter);
            }
        for(let i = 0 ; i < 0 ; i++){
            const tube = new FlowTube(
                this.tubes, 
                this.flow, 
                {
                    x:lerp(Math.random(), center -0.25, center + 0.25), 
                    y:lerp(Math.random(), 0.1, .5), 
                    z:lerp(Math.random(), center -0.25, center + 0.25)
                },
                extraMaterial);
            }
        }
        removeTubes(){
            for (let i = this.tubes.children.length - 1; i >= 0; i--) {
                this.tubes.remove(this.tubes.children[i]);
            }
        }
        reTube(){       
            this.removeTubes(); 
            this.addTubes();
        }
        
    }