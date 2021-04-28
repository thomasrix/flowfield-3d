const Parcel = require('parcel-bundler');
const fs = require('fs-extra');
const watcher = require('glob-watcher');

let dev = ()=>{
    const parcel = new Parcel(
        ['./src/script/index.html', '../assets/**/*'],
        {
            outDir:'./dev'
        }
        );
        fs.copy('./src/assets', './dev/assets', {overwrite:true});
    
        const watch = watcher('./src/assets/**/*.*', (watchdone)=>{
            // console.log('watch triggered')
            fs.emptyDirSync('./dev/assets');
            fs.copy('./src/assets', './dev/assets', {overwrite:true});
            parcel.hmr.broadcast({
                type:'reload'
            })
            watchdone()
        });
        parcel.bundle();
        parcel.serve();
    }
    dev();