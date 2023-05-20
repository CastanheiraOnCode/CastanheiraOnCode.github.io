import * as THREE from 'three'
import {minX, maxX, minY, maxY, minZ, maxZ,asteroids,scene,clock,renderer,camera} from './main.js'


export function createLight() {

    //LIGHTS
    var directionalLight = new THREE.DirectionalLight({color: 0xFFFFFF, intensity:100});
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    //Ambient Light
    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
    scene.add(ambientLight);
}