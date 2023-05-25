import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let spaceship = null;

// Create scene
let scene = new THREE.Scene();

// Normal camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create light
let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

let gltfLoader = new GLTFLoader();
var loader = new THREE.TextureLoader();
var sky = loader.load('images/sky.jpg');
scene.background = sky;

let ship = null;
let targetPosition = new THREE.Vector3();
let movementSpeed = 0.01;

gltfLoader.load('models/cockpit/scene.gltf', (gltf) => {
  ship = gltf.scene;
  ship.name = "ship";
  ship.traverse(n => {
    if (n.isMesh) {
      n.castShadow = true;
      n.receiveShadow = true;
    }
  });
  ship.scale.set(0.2, 0.2, 0.2);
  ship.position.set(5, 2, 0);
  ship.rotation.y = 0.5;
  ship.rotation.x = 0.5;
  ship.rotation.z = 0.5;
  scene.add(ship);

  // Start the animation loop
  animate();
});

// Adjust the camera position
camera.position.z = 5;

// Randomly update ship's position
function updateShipPosition() {
  targetPosition.x = Math.random() * 4 - 2;
  targetPosition.y = Math.random() * 4 - 2;
  targetPosition.z = Math.random() * 4 - 2;
}

// Update ship's rotation based on movement direction
function updateShipRotation() {
  if (ship) {
    let direction = targetPosition.clone().sub(ship.position).normalize();
    let targetQuaternion = new THREE.Quaternion();
    targetQuaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
    ship.quaternion.rotateTowards(targetQuaternion, 0.05);
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update ship's position
  if (ship) {
    let delta = movementSpeed;
    let currentPosition = ship.position.clone();
    let direction = targetPosition.clone().sub(currentPosition).normalize();
    let newPosition = currentPosition.add(direction.multiplyScalar(delta));

    ship.position.copy(newPosition);

    if (currentPosition.distanceTo(targetPosition) < delta) {
      updateShipPosition();
    }

    updateShipRotation();
  }

  // Render the scene
  renderer.render(scene, camera);
}

// Function to handle window resize
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleWindowResize, false);