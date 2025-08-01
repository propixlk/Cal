import * as THREE from 'three';

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true // Make canvas background transparent
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(5, 15, 20);
scene.add(pointLight);


// --- Floating Shapes ---
const shapes = [];
const shapeGroup = new THREE.Group();

const geometry1 = new THREE.IcosahedronGeometry(2, 0);
const geometry2 = new THREE.TorusGeometry(2, 0.5, 16, 100);
const geometry3 = new THREE.SphereGeometry(1.5, 32, 16);

// Using a Standard Material which reacts to light
const material = new THREE.MeshStandardMaterial({
    color: 0x5FBDB5, // --accent-color
    metalness: 0.3,
    roughness: 0.6,
});

const material2 = new THREE.MeshStandardMaterial({
    color: 0xFF6B6B, // --operator-red
    metalness: 0.2,
    roughness: 0.8,
});

function addShape() {
    let geo;
    const mat = Math.random() > 0.7 ? material2 : material;
    const rand = Math.random();

    if (rand < 0.33) geo = geometry1;
    else if (rand < 0.66) geo = geometry2;
    else geo = geometry3;
    
    const shape = new THREE.Mesh(geo, mat);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    shape.position.set(x, y, z);

    const [rx, ry, rz] = Array(3).fill().map(() => Math.random() * 0.005);
    shape.rotation.set(rx, ry, rz);
    
    shape.userData.rotationSpeed = { x: rx, y: ry, z: rz };
    
    shapeGroup.add(shape);
    shapes.push(shape);
}

Array(25).fill().forEach(addShape);
scene.add(shapeGroup);


// --- Mouse Interaction ---
const cursorGlow = document.querySelector('.cursor-glow');
let mouseX = 0;
let mouseY = 0;

function onMouseMove(event) {
    // Update cursor glow position
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    
    // Normalize mouse position (-1 to 1) for parallax
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove);


// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Animate shapes
    shapes.forEach(shape => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
    });

    // Parallax effect for the group of shapes
    // A gentle rotation based on mouse position
    shapeGroup.rotation.y = mouseX * 0.1;
    shapeGroup.rotation.x = mouseY * 0.1;

    renderer.render(scene, camera);
}

animate();


// --- Handle Window Resize ---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);