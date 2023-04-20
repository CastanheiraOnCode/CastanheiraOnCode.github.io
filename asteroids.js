

 
 //INIT THREE JS
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({antialias: true});

//properties
scene.background = new THREE.Color( 0x000000 );
renderer.setSize( window.innerWidth, window.innerHeight );

//camera position
camera.position.z = 5;
camera.position.y = 0;

document.body.appendChild( renderer.domElement );
//LIGHTS
var directionalLight = new THREE.DirectionalLight({color: 0xFFFFFF, intensity:100});
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

//Ambient Light
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
scene.add(ambientLight);

let grid = new THREE.GridHelper(100, 20, 0x0a0a0a, 0x0a0a0a);
grid.position.set(0, -0.5, 0);
scene.add(grid);

let bGeo = new THREE.BoxGeometry(1, 1, 1);
let bMat = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: false});
let cube = new THREE.Mesh(bGeo, bMat);
scene.add(cube);


//let controls = new THREE.PointerLockControls(camera, renderer.domElement);

let clock = new THREE.Clock();

let btn1 = document.querySelector("#button1");

btn1.addEventListener("click", ()=>{
    controls.lock();
});

function drawScene(){
    renderer.render(scene, camera);
    requestAnimationFrame(drawScene);
}

drawScene()