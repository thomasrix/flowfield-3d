'use stric'
import '../../style/canvas.scss';
import {create, select} from '../utils/trix';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import SimpleTube from './SimpleTube';
import Controllers from './controller';
import Flow from './flow';
import FlowTube from './FlowTube';


export default class SecondField{
    constructor(){
        console.log('first constructed');
        this.width = 1920;
        this.height = 1920;
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
        this.tubes = new THREE.Group();
        this.scene.add(this.tubes);
        // this.addTubes();
        this.scene.add(new THREE.GridHelper());
        
        this.controls = new OrbitControls( this.camera, this.canvas );
        this.controls.update();
        // this.controls.autoRotate = true;
        this.renderer.render(this.scene, this.camera); 
        this.boundAni = this.animate.bind(this);
        this.boundAni();
        
        this.settings.addSaveButton(this.tubes);
        this.settings.gui.add(this, 'reTube');
    }
    animate(){
        // console.log('animate');
        requestAnimationFrame(this.boundAni);
        this.controls.update();
        this.renderer.render(this.scene, this.camera); 
    }
    addCamera(){
        this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 24;
        this.camera.position.x = 0;
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
    
    addLine(){
        const curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( -10, 0, 10 ),
            new THREE.Vector3( -5, 5, 5 ),
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 5, -5, 5 ),
            new THREE.Vector3( 10, 0, 10 )
        ] );
        
        const points = curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        
        const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
        
        // Create the final object to add to the scene
        const curveObject = new THREE.Line( geometry, material );
        curveObject.scale.set(0.2, 0.2, 0.2);
        curveObject.position.set(0, 2, 0);
        this.scene.add(curveObject);
    }
    addFlow(){
        this.flow = new Flow(this.scene, 5);
        this.settings.addFlowControllers(this.flow);
    }
    addTubeWithEnd(){

    }
    addTubes(){
        
        for(let i = 0 ; i < 200 ; i++){
            const tube = new FlowTube(this.tubes, this.flow, {x:10+i/10, y:15, z:10});
        }
    }
    reTube(){        
        for (let i = this.tubes.children.length - 1; i >= 0; i--) {
            this.tubes.remove(this.tubes.children[i]);
        }
        this.addTubes();
    }
}