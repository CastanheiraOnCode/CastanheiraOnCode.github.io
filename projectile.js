import * as THREE from 'three'
import {minX, maxX, minY, maxY, minZ, maxZ,asteroids,scene,clock,renderer,camera} from './main.js'

let projectile;
let points = 0
// Define the gravity vector
const gravity = new THREE.Vector3(0, -0.05, 0);
const loader = new THREE.TextureLoader();
const texture = loader.load("images/explosion_texture.png");
export function createProjectile() {
    // Define the geometry and material for the projectile
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    
    // Create the projectile mesh using the geometry and material
    projectile = new THREE.Mesh(geometry, material);
    
    // Set the initial position of the projectile to the camera position
    projectile.position.copy(camera.position);
    
    // Add the projectile to the scene
    scene.add(projectile);
    
    return projectile
}

export function updateProjectile() {
    // Check if the projectile exists and has a velocity
    if (projectile && projectile.velocity) {
        // Update the position of the projectile based on its velocity
        projectile.position.add(projectile.velocity);
        
        // Check collision with each asteroid
        for (let i = 0; i < asteroids.length; i++) {
            const asteroid = asteroids[i];
            
            // Check if the projectile intersects with the asteroid
            const projectileBox = new THREE.Box3().setFromObject(projectile);
            const asteroidBox = new THREE.Box3().setFromObject(asteroid);
            
            if (projectileBox.intersectsBox(asteroidBox)) {
                // Collision detected
                console.log("Projectile hit an asteroid!");
                
                const particleVelocity = new THREE.Vector3(1, 1, 1); // Set the desired particle velocity
                points += 10;
                // Create a particle system for the explosion
                // make particleCount variable be random integer between 100 and 500
                var particleCount = 250;
                const particles = new THREE.BufferGeometry();
                
                // Add position attribute to the particles BufferGeometry
                const positions = new Float32Array(particleCount * 3);
                const colors = new Float32Array(particleCount * 3);
                const velocities = new Float32Array(particleCount * 3);
                particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
                
             
                // Generate random positions for the particles in a sphere with irregularity
                    const baseRadius = 0.5;
                    const maxOffset = 0.9; // Maximum offset from the base radius

                    for (let i = 0; i < particleCount * 3; i += 3) {
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(2 * Math.random() - 1);
                    
                    // Randomize the radius offset
                    const offset = (Math.random() * 2 - 1) * maxOffset;
                    const radius = baseRadius + offset;
                    
                    const pX = radius * Math.sin(phi) * Math.cos(theta);
                    const pY = radius * Math.sin(phi) * Math.sin(theta);
                    const pZ = radius * Math.cos(phi);
                    
                    positions[i] = pX;
                    positions[i + 1] = pY;
                    positions[i + 2] = pZ;

                        // Set particle colors based on position and make them darker
                    colors[i] = (pX + 0.2) / 0.4 * 0.5;   // Red component
                    colors[i + 1] = (pY + 0.2) / 0.4 * 0.5; // Green component
                    colors[i + 2] = (pZ + 0.2) / 0.4 * 0.5; // Blue component
                    
                    
                    // Generate random velocities for the particles
                    const vX = Math.random() * 0.4 - 0.2;
                    const vY = Math.random() * 0.4 - 0.2;
                    const vZ = Math.random() * 0.4 - 0.2;
                    velocities[i] = vX;
                    velocities[i + 1] = vY;
                    velocities[i + 2] = vZ;
                    

                }
                
                particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
                particles.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
                particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));
                const pMaterial = new THREE.PointsMaterial({
                    size: 0.5,
                    vertexColors: true,
                    map: texture,
                    transparent: true,
                });
                
                console.log(pMaterial.map)
                const particleSystem = new THREE.Points(particles, pMaterial);
                scene.add(particleSystem);
                
                particleSystem.position.copy(asteroid.position);
                particleSystem.visible = true;
                particleSystem.name = "particleSystem";
                
                // Update the particle positions and animate them
                
                const particleVelocities = particleSystem.geometry.attributes.velocity;
                function animateParticles(gravity) {
                    const particlePositions = particleSystem.geometry.attributes.position;
                    for (let i = 0; i < particlePositions.count * 3; i += 3) {
                        particlePositions.array[i] += particlePositions.array[i] * 0.02;
                        particlePositions.array[i + 1] += particlePositions.array[i + 1] * 0.02;
                        particlePositions.array[i + 2] += particlePositions.array[i + 2] * 0.02;
                      }
            
                      particlePositions.needsUpdate = true
                  
                    particlePositions.needsUpdate = true;
                    renderer.render(scene, camera);
                  
                    requestAnimationFrame(() => animateParticles(gravity));
                  }

                  animateParticles(gravity);
                
                  // remove the particles after 2 seconds
                    setTimeout(function() {
                        scene.remove(particleSystem);   
                    }, 2000);
    
                
                
                // Remove the projectile and asteroid
                scene.remove(projectile);
                scene.remove(asteroid);
                asteroids.splice(i, 1);

                const pointsDisplay = document.getElementById('points-display');
                pointsDisplay.textContent = points.toString();
                
                // Exit the loop since the asteroid is destroyed
                break;
            }
        }
    }
}
