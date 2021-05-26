'use strict'
import * as dat from 'dat.gui';
import {create, select, norm} from '../utils/trix';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter';

import {Panel, Button, HSlider} from '../utils/minimalcomps.mjs';

export default class Controllers{
    constructor(){
        this.build()
    }
    build(){
        this.gui = new dat.GUI({
            useLocalStorage:true
        });
        // this.gui.close();
        // this.settingsContainer = create('div', select('body'), 'settings-container');
        // this.addPanel();
        
    }
    addPanel(){
        const panel = new Panel(this.settingsContainer, 0, 0, 200, 400);
        new HSlider(panel, 20, 20, "Velocity", 0, 0, 100);
        // new Button(panel, 20, 20, "Save!", () => this.re);
    }
    addSaveButton(object){
        this.link = document.createElement( 'a' );
        this.link.style.display = 'none';
        document.body.appendChild( this.link ); // Firefox workaround, see #6594
        
        this.saveObject = object;
        this.gui.add(this, 'save');
    }
    save(){
        console.log('save');
        
        const link = this.link;
        
        function saveIT( blob, filename ) {
            console.log('text', blob)
            
            link.href = URL.createObjectURL( blob );
            link.download = filename;
            link.click();
            
        }
        
        function saveString( text, filename ) {
            saveIT( new Blob( [ text ], { type: 'text/plain' } ), filename );
            
        }
        // Instantiate a exporter
        const exporter = new GLTFExporter();
        
        // Parse the input and generate the glTF output
        exporter.parse( this.saveObject, function ( gltf ) {
            console.log( gltf );
            saveString( JSON.stringify( gltf, null, 2 ), 'scene.gltf');
        }, {} );
    }
    addLightController(light){
        console.log('add light');
        // this.gui.remember(color);
        // this.gui.remember(strength);
        this.gui.getSaveObject();
        const color = {
            d_light:[255, 255, 255]
        }
        const strength = {
            d_light:0.5
        }
        
        this.gui.add(strength, 'd_light', 0, 1, 0.1).onFinishChange(()=>{
            light.intensity = strength.d_light;
        });
        
        this.gui.addColor(color, 'd_light').onFinishChange(()=>{
            let r = norm(color.d_light[0], 0, 255);
            let g = norm(color.d_light[1], 0, 255);
            let b = norm(color.d_light[2], 0, 255);
            console.log('change color', color, r);
            light.color.setRGB(r, g, b);
        });
    }
    addFlowControllers(flow){
        const flowFolder = this.gui.addFolder('Flow Controls');
        flowFolder.add(flow, 'showFlow');
        flowFolder.add(flow, 'hideFlow');
        flowFolder.add(flow, 'copyFlow');
        flowFolder.add(flow, 'redrawOnChange');
        
        flowFolder.add(flow.parameters, 'scale', 0, 1, 0.05).onFinishChange(()=>{
            flow.redrawFlow();
        });
        flowFolder.add(flow.parameters, 'a', -1, 1, 0.05).onFinishChange(()=>{
            flow.redrawFlow();
        });
        flowFolder.add(flow.parameters, 'b', -1, 1, 0.05).onFinishChange(()=>{
            flow.redrawFlow();
        });
        flowFolder.add(flow.parameters, 'c', -1, 1, 0.05).onFinishChange(()=>{
            flow.redrawFlow();
        });
        flowFolder.add(flow.parameters, 'd', -1, 1, 0.05).onFinishChange(()=>{
            flow.redrawFlow();
        });
        flowFolder.add(flow.parameters, 'e', -1, 1, 0.05).onFinishChange(()=>{
            flow.redrawFlow();
        });
        flowFolder.add(flow.parameters, 'f', -1, 1, 0.05).onFinishChange(()=>{
            flow.redrawFlow();
        });
        
    }
}
