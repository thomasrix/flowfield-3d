'use strict'
import * as dat from 'dat.gui';
import {norm} from '../utils/trix';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter';

export default class Controllers{
    constructor(){
        this.build()
    }
    build(){
        this.gui = new dat.GUI({
            useLocalStorage:true
        });
        
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

            // URL.revokeObjectURL( url ); breaks Firefox...

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
        const color = {
            d_light:[255, 255, 0]
        }
        this.gui.addColor(color, 'd_light').onFinishChange(()=>{
            let r = norm(color.d_light[0], 0, 255);
            let g = norm(color.d_light[1], 0, 255);
            let b = norm(color.d_light[2], 0, 255);
            console.log('change color', color, r);
            light.color.setRGB(r, g, b);
        });
    }
}
