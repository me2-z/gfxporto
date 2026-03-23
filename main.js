import * as THREE from 'three';

// --- Scene Setup ---
const canvas = document.querySelector('#bg');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030303, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Position camera to look down the plane
camera.position.set(0, -50, 60);
camera.lookAt(0, 50, 0);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// --- Geometry & Material ---
// Large plane with many segments for smooth vertex displacement
const geometry = new THREE.PlaneGeometry(400, 400, 100, 100);

// We use RawShaderMaterial or ShaderMaterial to create the grid lines and warp effect
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Smooth, slow wave distortion across the grid
    float wave1 = sin(pos.x * 0.03 + uTime * 0.4) * 15.0;
    float wave2 = cos(pos.y * 0.04 + uTime * 0.3) * 15.0;
    pos.z += wave1 + wave2;

    // Curved perspective (drops edges to form a warped tunnel/sphere look)
    float dist = length(pos.xy);
    pos.z -= dist * dist * 0.015;
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform vec3 uColor;

  void main() {
    // Determine grid lines (anti-aliased)
    vec2 gridCount = vUv * 60.0; // Grid density
    vec2 grid = abs(fract(gridCount - 0.5) - 0.5) / fwidth(gridCount);
    float line = min(grid.x, grid.y);
    
    // Soft glow effect based on line proximity
    float alpha = 1.0 - min(line, 1.0);
    // Add slightly more thickness for a soft glow
    alpha += max(0.0, 1.0 - line * 0.5) * 0.5;

    // Depth of field / Fade out in the distance (Z is negative in camera space, but in world space here it drops down)
    // We use the distance from center to fade it out as well
    float distSq = dot(vPosition.xy, vPosition.xy);
    float distanceFade = smoothstep(30000.0, 0.0, distSq);

    // Vignette (darker edges)
    float vignette = smoothstep(0.8, 0.2, length(vUv - 0.5));

    gl_FragColor = vec4(uColor, alpha * distanceFade * vignette * 0.6);
  }
`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0xefefef) } // Off-white/grey grid lines
  },
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  wireframe: false,
  extensions: {
    derivatives: true // needed for fwidth
  }
});

const plane = new THREE.Mesh(geometry, material);
// Rotate plane to lie flat on the ground
// plane.rotation.x = -Math.PI / 2;
scene.add(plane);


// --- Interactive Effects (Parallax) ---
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
});


// --- Scroll Effects ---
let scrollY = window.scrollY;
document.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  
  // Navbar glass effect on scroll
  const nav = document.querySelector('.navbar');
  if(scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  // Update uniforms
  material.uniforms.uTime.value = elapsedTime;

  // Parallax Ease
  targetX = mouseX * 0.05;
  targetY = mouseY * 0.05;
  
  // Base camera position + Parallax + Scroll Shift
  // The scroll slowly moves the camera forward into the grid
  const scrollOffset = scrollY * 0.05;
  
  camera.position.x += (targetX - camera.position.x) * 0.02;
  camera.position.y += (-50 - targetY + scrollOffset - camera.position.y) * 0.02;
  
  // Add slight rotation for cinematic feel
  camera.rotation.z = Math.sin(elapsedTime * 0.2) * 0.02;

  // Film grain (procedural simple noise additive on top) implemented via post-processing or we just rely on CSS 
  // For maximum performance we skip expensive post-processing, grid alone gives 60fps premium look.
  
  renderer.render(scene, camera);
}

animate();

// --- Resize Handler ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});
