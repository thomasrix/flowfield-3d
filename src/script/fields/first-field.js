'use stric'
import '../../style/canvas.scss';
import {create, select} from '../utils/trix';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

export default class FirstField{
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
        this.buildScene();
    }
    buildScene(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('hsl(180, 1%, 3%)');
        this.renderer = new THREE.WebGLRenderer({
            context:this.ctx
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        console.log(this.renderer)
        this.renderer.setSize(this.width, this.height);

        
        this.addCamera();
        this.addLights();
        this.addPlane();
        // this.addSphere();
        // this.addLine();
        this.addTube();

        this.controls = new OrbitControls( this.camera, this.canvas );
        this.controls.update();
        console.log(this.renderer.domElement);
        // this.controls.autoRotate = true;
        this.renderer.render(this.scene, this.camera); 
        this.boundAni = this.animate.bind(this);
        this.boundAni();
        
    }
    animate(){
        // console.log('animate');
        requestAnimationFrame(this.boundAni);
        this.controls.update();
        this.renderer.render(this.scene, this.camera); 
    }
    addCamera(){
        this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 12;
        this.camera.position.x = 0;
        this.camera.position.y = 5;
    
        // this.camera.lookAt(0, 0, 0);
        
        this.scene.add(this.camera);
        
    }
    addLights(){
        this.scene.add(new THREE.AmbientLight('hsl(0, 0%, 90%)'));
        let d_light = new THREE.PointLight( 0xffffcc, 1, 0, 2);
        
        d_light.castShadow = true;
        d_light.shadow.mapSize.width = 2048; // default
        d_light.shadow.mapSize.height = 2048; // default
        d_light.shadow.camera.near = 0.5; // default
        d_light.shadow.camera.far = 500; // default


        d_light.position.set( 10, 15, 7 );
        
        this.scene.add(d_light);

    }
    addPlane(){
        this.planeGeom = new THREE.PlaneGeometry(5, 5, 10, 10);

        const material = new THREE.MeshStandardMaterial({
            color: '#666',
            metalness:0,
            roughness:0.1,
            wireframe:false,
            side:THREE.DoubleSide
        });

        this.plane = new THREE.Mesh(this.planeGeom, material);
        this.plane.rotateX(-Math.PI * 0.5);
        this.plane.receiveShadow = true;
        this.scene.add(this.plane);

        console.log(this.plane.position)
    }
    addSphere(){
        this.sphereGeom = new THREE.SphereGeometry( 0.25, 32, 32 );

        const material = new THREE.MeshStandardMaterial({
            color: '#ff0000',
            metalness:0.5,
            roughness:0.1,
            wireframe:false
        });

        const mesh = new THREE.Mesh(this.sphereGeom, material);
        mesh.position.y = 0.75;
        mesh.castShadow = true;
        this.scene.add(mesh);

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
    addTube(){
        const p = [
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 0, 2, -2 ),
            new THREE.Vector3( 0, 6, 2 ),
            new THREE.Vector3( 1, 7, 1 ),
            new THREE.Vector3( -3, 8, -1 ),
        ];
        const curve = new THREE.CatmullRomCurve3( p, false, 'catmullrom', 1);
        
        const points = curve.getPoints( 50 );
        // const geometry = new THREE.BufferGeometry().setFromPoints( points );
        
        const geometry = new THREE.TubeGeometry( curve, 64, 0.05, 8, false );
        // const material = new THREE.MeshBasicMaterial( { color: 0x992233 } );
        const material = new THREE.MeshStandardMaterial({
            color: '#ff0000',
            metalness:0.5,
            roughness:0.1,
            wireframe:false,
            side:THREE.DoubleSide
        });
        const mesh = new THREE.Mesh( geometry, material );
        // mesh.scale.set(0.2, 0.2, 0.2);
        mesh.position.set(0, 0, 0);
        this.scene.add(mesh);
    }
}