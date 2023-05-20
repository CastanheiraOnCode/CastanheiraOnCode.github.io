import * as THREE from 'three';
import { minX, maxX, minY, maxY, minZ, maxZ, asteroids, scene, clock, renderer, camera, projectile } from './main.js';
import { gltfLoader } from './main.js';
export function createAsteroids() {
    let loader = new THREE.TextureLoader();
    loader.setPath('images/'); // Set the base path for loading textures

    let asteroidTexture1 = loader.load("asteroid1.png");
    let asteroidTexture2 = loader.load("asteroid2.png");
    let asteroidTexture3 = loader.load("asteroid3.png");
    let asteroidTexture4 = loader.load("asteroid4.png");
    let asteroidDisplacementMap = loader.load("asteroid-displacement.jpg");

    // Set texture wrapping and filtering options
    asteroidTexture1.wrapS = THREE.RepeatWrapping;
    asteroidTexture1.wrapT = THREE.RepeatWrapping;
    asteroidTexture1.repeat.set(5, 6); // Adjust the repeat values
    asteroidTexture1.anisotropy = renderer.capabilities.getMaxAnisotropy();

    asteroidTexture2.wrapS = THREE.RepeatWrapping;
    asteroidTexture2.wrapT = THREE.RepeatWrapping;
    asteroidTexture2.repeat.set(3, 4); // Adjust the repeat values
    asteroidTexture2.anisotropy = renderer.capabilities.getMaxAnisotropy();

    asteroidTexture3.wrapS = THREE.RepeatWrapping;
    asteroidTexture3.wrapT = THREE.RepeatWrapping;
    asteroidTexture3.repeat.set(5, 6); // Adjust the repeat values
    asteroidTexture3.anisotropy = renderer.capabilities.getMaxAnisotropy();

    asteroidTexture4.wrapS = THREE.RepeatWrapping;
    asteroidTexture4.wrapT = THREE.RepeatWrapping;
    asteroidTexture4.repeat.set(5, 6); // Adjust the repeat values
    asteroidTexture4.anisotropy = renderer.capabilities.getMaxAnisotropy();


    let asteroidMaterial1 = new THREE.MeshPhongMaterial({
        map: asteroidTexture1,
        displacementMap: asteroidDisplacementMap,
        displacementScale: Math.random() * (0.8 - 0.3) + 0.3
    });

    let asteroidMaterial2 = new THREE.MeshPhongMaterial({
        map: asteroidTexture2,
        displacementMap: asteroidDisplacementMap,
        displacementScale: Math.random() * (0.8 - 0.3) + 0.3
    });

    let asteroidMaterial3 = new THREE.MeshPhongMaterial({
        map: asteroidTexture3,
        displacementMap: asteroidDisplacementMap,
        displacementScale: Math.random() * (0.8 - 0.3) + 0.3
    });

    let asteroidMaterial4 = new THREE.MeshPhongMaterial({
        map: asteroidTexture4,
        displacementMap: asteroidDisplacementMap,
        displacementScale: Math.random() * (0.8 - 0.3) + 0.3
    });

    let asteroidMaterials = [asteroidMaterial1, asteroidMaterial2, asteroidMaterial3, asteroidMaterial4];

    for (let i = 0; i < 20; i++) {
        let bGeo = new THREE.SphereGeometry(Math.random() * (6 - 1) + 1 + Math.random(), 32, 16);
        let asteroidMaterial = asteroidMaterials[Math.floor(Math.random() * 4)];

        let asteroid = new THREE.Mesh(bGeo, asteroidMaterial);

        // Randomize position and rotation within a specified range
        asteroid.position.x = Math.random() * (maxX - minX) + minX;
        asteroid.position.y = Math.random() * (maxY - minY) + minY;
        asteroid.position.z = Math.random() * (maxZ - minZ) + minZ;

        // Randomize scale
        let scale = 0.5 + Math.random() * 1.5;
        asteroid.scale.set(scale, scale, scale);

        asteroids.push(asteroid);
        scene.add(asteroid);
    }

    return asteroids;
}

export function animateAsteroids(time) {
    const dt = clock.getDelta();

    for (let asteroid of asteroids) {
        // Independent movement for each asteroid
        const movementOffset = asteroid.movementOffset || new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        asteroid.movementOffset = movementOffset;

        asteroid.position.x += Math.cos(time / 1000 + movementOffset.x) * 0.1;
        asteroid.position.y += Math.sin(time / 1000 + movementOffset.y) * 0.1;
        asteroid.position.z += Math.cos(time / 1000 + movementOffset.z) * 0.1;
        asteroid.rotation.x = time / 2000;
        asteroid.rotation.y = time / 1000;
    }
}

export { scene, camera, renderer, asteroids };
