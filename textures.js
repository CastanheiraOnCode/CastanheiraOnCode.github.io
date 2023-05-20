import * as THREE from 'three';
import { gltfLoader,scene ,camera} from './main.js';

let solar_system =  null;
let cockpit = null;
let crosshair = null;

export function createObjects() {
    
    // reset gltf loader
    gltfLoader.load('models/solar_system/scene.gltf', (gltf) => {
	//set big sun scale and position out of bounding box
    console.log("gltfLoader", gltf.scene);
    let solar_system=gltf.scene;
    solar_system = gltf.scene;
    solar_system.name = "solar_system";
    solar_system.traverse(n=>{n.castShadow=true;
                    n.receiveShadow=true;
                    });
	solar_system.scale.set(50,50,50);
	solar_system.position.set(0,0,-200);
    //make sun rotatio animation
    solar_system.rotation.y = 0.5;

	scene.add(solar_system);

	  });
    
    //load black hole
    gltfLoader.load('models/black_hole/scene.gltf', (gltf) => {
    let black_hole=gltf.scene;
    black_hole.name = "black_hole";
    black_hole.traverse(n=>{n.castShadow=true;
                    n.receiveShadow=true;
                    });
    black_hole.scale.set(50,50,50);
    black_hole.position.set(0,0,200);


    scene.add(black_hole);

        });
   
    return solar_system;



}

export {solar_system};