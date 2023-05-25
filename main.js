
import * as THREE from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
// import gltf loader
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { createAsteroids,animateAsteroids } from './asteroids.js';
import { createProjectile, updateProjectile, points } from './projectile.js';
import { createLight } from './lights.js';
import {  createObjects } from './textures.js';
import { CustomPointerLockControls } from './customPointerLockControls.js';




//INIT THREE JS
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight*0.5, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({antialias: true});
var loader  = new THREE.TextureLoader()
var sky = loader.load( "images/sky.jpg");
var asteroid_text = loader.load("images/asteroid1.png"); 
// Create a variable to keep track of the number of asteroids created
let numAsteroids = 0;
let asteroids = [];
//gltf loader
const gltfLoader = new GLTFLoader();
// Add a variable to keep track of the points



// Define the limits of the bounding box
const minX = -75;
const maxX = 75;
const minY = -75;
const maxY = 75;
const minZ = -75;
const maxZ = 75;

scene.background = sky;
//scene.background = new THREE.Color( 0xfafafa );
renderer.setSize( window.innerWidth, window.innerHeight );

//camera position
camera.position.z = 5;
camera.position.y = 0;

document.body.appendChild( renderer.domElement );


let clock = new THREE.Clock();
let projectile;
//export bounding box limits

// Add an event listener to listen for clicks on the canvas
document.addEventListener('mousedown', onMouseDown, false);

createLight()
createAsteroids(20)

//attach cube to camera and make it move with the camera
// Create a group to hold the cubes
const cubeGroup = new THREE.Group();
scene.add(cubeGroup)

const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
//material that uses illumination

const modelInstances = [];

//load texture to the cubes
gltfLoader.load('models/med_kit/scene.gltf', (gltf) => {
	gltf.scene.scale.set(0.1,0.1,0.1);
	gltf.scene.rotation.y = -0.5;
	
	const modelInstance1 = gltf.scene.clone();
	const modelInstance2 = gltf.scene.clone();
	const modelInstance3 = gltf.scene.clone();
	
	
	
	modelInstance1.position.set(1.5,1.4,-5);
	modelInstance2.position.set(1.5,1.6,-5);
	modelInstance3.position.set(1.5,1.8,-5);
	
	modelInstances.push(modelInstance1);
	modelInstances.push(modelInstance2);
	modelInstances.push(modelInstance3);
	
	cubeGroup.add(modelInstance1);
	cubeGroup.add(modelInstance2);
	cubeGroup.add(modelInstance3);
	
});


createObjects()
gltfLoader.load('models/cockpit/scene.gltf', (gltf) => {
	
	let cockpit = gltf.scene;
	cockpit.name = "cockpit";
	cockpit.traverse(n=>{n.castShadow=true;
		n.receiveShadow=true;
	});
	cockpit.scale.set(2,2,2);
	cockpit.position.set(0,-3,-0.5);
	//rotate 180 degrees
	cockpit.rotation.y = 3.14;
	
	cubeGroup.add(cockpit);
});

//load crosshair
gltfLoader.load('models/crosshair/scene.gltf', (gltf) => {      
	let crosshair = gltf.scene;
	crosshair.name = "crosshair";
	crosshair.traverse(n=>{n.castShadow=true;
		n.receiveShadow=true;
	});
	crosshair.scale.set(0.5,0.5,0.5);
	crosshair.position.set(0,0,-5);
	
	cubeGroup.add(crosshair);
});


let controls = new CustomPointerLockControls(camera, renderer.domElement);

// Define the onMouseDown function
function onMouseDown(event) {
	// Check if pointer lock controls are enabled
	
	if (controls.isLocked) {
		// Calculate the direction vector from the camera to the mouse pointer
		projectile = createProjectile();
		const direction = new THREE.Vector3(
			event.movementX,
			event.movementY,
			1
			).unproject(camera)
			.sub(camera.position)
			.normalize();
			
			// Set the velocity of the projectile based on the direction vector
			const velocity = direction.multiplyScalar(5);
			
			// Set the position of the projectile to the camera position
			projectile.position.copy(camera.position);
			
			// Set the velocity of the projectile
			projectile.velocity = velocity;
			
			// Add the projectile to the scene
			scene.add(projectile);
		}
	}
	
	let collisionEnabled = false; // Variable to track collision checking
	
	
	
	let collisionTimeout = null; // Timeout variable for disabling collision checking
	
	function disableCollisionsForTimeout() {
		collisionEnabled = false;
		clearTimeout(collisionTimeout);
		collisionTimeout = setTimeout(() => {
			collisionEnabled = true;
		}, 3000); // Disable collision checking for 3 seconds
	}
	
	
	
	
	let btn1 = document.querySelector("#button1");
	
	btn1.addEventListener("click", ()=>{
		controls.lock();
		//hide the button
		btn1.style.display = "none";
		// set background color of the div with id = "container" to transparent	";
		document.getElementById("container").style.backgroundColor = "transparent";
		collisionEnabled = true;
		
	});
	
	let keyboard = [];
	addEventListener('keydown',(e)=>{
		keyboard[e.key] = true;
	});
	
	addEventListener('keyup',(e)=>{
		keyboard[e.key] = false;
	});
	
	function checkCollisions() {
		const cameraPosition = camera.position;
		
		// Check collision with each asteroid
		for (let i = 0; i < asteroids.length; i++) {
			const asteroid = asteroids[i];
			const asteroidPosition = asteroid.position;
			
			const distance = cameraPosition.distanceTo(asteroidPosition);
			
			// Adjust this value as needed to control the collision radius
			const collisionDistance = 13;
			
			if (distance < collisionDistance) {
				// Collision detected
				// Do something, e.g., end the game, show a message, etc.
				console.log("Collision detected!");
				
				// create explosion at the position of the asteroid
				// Remove one of the model instances from the scene and the modelInstances array
				const removedModelIndex = Math.floor(Math.random() * modelInstances.length);
				const removedModelInstance = modelInstances.splice(removedModelIndex, 1)[0];
				cubeGroup.remove(removedModelInstance);
				
				//if modelInstances is empty, then all the cubes have been destroyed, GAME OVER
				if (modelInstances.length == 0) {
					// Show the game over message
					//set the div with id = container  to rgba 0,0,0,0.7
					document.getElementById("container").style.backgroundColor = "rgba(0,0,0,0.9)";
					const gameOverDiv = document.getElementById("game-over");
					gameOverDiv.style.display = "block";
					controls.unlock();
					collisionEnabled = false
					// remove the event listener for the mouse click
					document.removeEventListener("mousedown", onMouseDown);
					
					//update span with id = score
					document.getElementById("score").innerHTML = points;
					
				}
				
				// Shake the camera by inclining to the left and then to the right
				/*const shakeIntensity = 0.03; // Adjust the intensity of the shake
				const shakeDuration = 1000; // Duration of the shake in milliseconds
				
				const originalCameraPosition = camera.position.clone();
				const originalCameraRotation = camera.rotation.clone();
				
				let shakeTime = 0;
				const shakeInterval = setInterval(() => {
					if (shakeTime < shakeDuration) {
						const elapsedTime = shakeTime / shakeDuration;
						const inclination = shakeIntensity * Math.sin(Math.PI * elapsedTime);
						
						camera.rotation.set(
							originalCameraRotation.x,
							originalCameraRotation.y + inclination,
							originalCameraRotation.z
							);
							
							shakeTime += 16; // Assuming a frame rate of 60fps (1000ms / 60 frames ≈ 16ms)
						} else {
							clearInterval(shakeInterval);
							camera.position.copy(originalCameraPosition);
							camera.rotation.copy(originalCameraRotation);
						}
					}, 16); // Assuming a frame rate of 60fps (1000ms / 60 frames ≈ 16ms)*/
					
					// Disable collision checking for 3 seconds
					document.getElementById("container").style.backgroundColor = "rgba(255,0,0,0.7)";
					setTimeout(()=>{
						//set the div with id = container  to rgba 0,0,0,0.7
						document.getElementById("container").style.backgroundColor = "transparent";
					}
					,300);
					disableCollisionsForTimeout();
					
					// change the screen color between red and transparent for 2 seconds
					//set the div with id = container  to rgba 255,0,0,0.7
					
				}
			}
		}
		
		
		function processkeyboard() {
			const moveSpeed = 0.2; // Adjust the movement speed as needed
			
			// Get the camera's direction vector
			const direction = new THREE.Vector3();
			controls.getDirection(direction);
			
			// Normalize the direction vector to ensure consistent movement speed
			direction.normalize();
			
			if (keyboard['w']) {
				// Move forward in the camera's direction
				camera.position.addScaledVector(direction, moveSpeed);
				
			}
			if (keyboard['s']) {
				// Move backward in the opposite direction of the camera
				camera.position.addScaledVector(direction, -moveSpeed);
				
			}
			if (keyboard['a']) {
				// Move left perpendicular to the camera's direction
				const perpendicular = new THREE.Vector3();
				perpendicular.crossVectors(direction, camera.up).normalize();
				camera.position.addScaledVector(perpendicular, -moveSpeed*0.5);
			}
			if (keyboard['d']) {
				// Move right perpendicular to the camera's direction
				const perpendicular = new THREE.Vector3();
				perpendicular.crossVectors(direction, camera.up).normalize();
				camera.position.addScaledVector(perpendicular, moveSpeed);
			}
			
			updateCameraPosition();
			// Check for collisions if collision checking is enabled
			if (collisionEnabled) {
				checkCollisions();
			}
		}
		
		
		
		
		// Update the camera position within the limits
		function updateCameraPosition() {
			camera.position.clampScalar(minX, maxX, minY, maxY, minZ, maxZ);
		}
		
		function animate(){
			
			//check length of asteroids array
			//if length is 10, then createAsteroids(10)
			
			if (asteroids.length <= 10) {
				createAsteroids(10);
				console.log("created 10 asteroids");
			}
			
			const gravity = new THREE.Vector3(0, -0.05, 0);
			if(modelInstances.length > 0){
				processkeyboard();
			}	
			cubeGroup.position.copy(camera.position);
			cubeGroup.rotation.copy(camera.rotation);
			updateProjectile();
			// Animate the particle system
			const particleSystem = scene.getObjectByName("particleSystem");
			
			if (particleSystem && particleSystem.visible) {
				const particlePositions = particleSystem.geometry.attributes.position;
				const particleVelocities = particleSystem.geometry.attributes.velocity;
				
				for (let i = 0; i < particlePositions.count; i++) {
					particlePositions.array[i * 3] += particleVelocities.array[i * 3] * 0.01; // Update x position
					particlePositions.array[i * 3 + 1] += particleVelocities.array[i * 3 + 1] * 0.01; // Update y position
					particlePositions.array[i * 3 + 2] += particleVelocities.array[i * 3 + 2] * 0.01; // Update z position
					
					// Apply gravity to the particles
					particlePositions.array[i * 3] += gravity.x;
					particlePositions.array[i * 3 + 1] += gravity.y;
					particlePositions.array[i * 3 + 2] += gravity.z;
				}
				
				particlePositions.needsUpdate = true;
				
				// Remove the particle system after 2s
				setTimeout(() => {
					scene.remove(particleSystem);
				}  , 2000);
				
			}
			
			// Animate the solar system
			const solarSystem = scene.getObjectByName("solar_system");
			if (solarSystem) {
				//rotate the solar system
				solarSystem.rotation.y += 0.001;
				
				//rotate the sun
				
			}
			
			
			renderer.setAnimationLoop( animateAsteroids );
			renderer.render(scene, camera);
			requestAnimationFrame(animate);
			
		}
		// Function to handle window resize
		function handleWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}
		
		window.addEventListener('resize', handleWindowResize, false);
		animate()
		
		export { gltfLoader,minX, maxX, minY, maxY, minZ, maxZ, asteroids,clock, projectile, scene, renderer, camera };