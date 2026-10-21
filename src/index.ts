
import * as THREE from "three";
import GUI from "lil-gui";

import vertexShader from "./shaders/cricketball.vert.glsl";
import fragmentShader from "./shaders/cricketball.frag.glsl";
import "./style.css";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 0, 4);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.appendChild(renderer.domElement);

// Cricket ground background.

const textureLoader = new THREE.TextureLoader();

const groundTextureUrl = new URL(
  "/Narendra_Modi_Stadium.jpg",
  document.baseURI
).href;

textureLoader.load(
  groundTextureUrl,
  (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.background = texture;
  },
  undefined,
  (error) => {
    console.error("Could not load Narendra_Modi_Stadium.jpg", error);
  }
);


// Sphere geometry.
const geometry = new THREE.SphereGeometry(0.5, 128, 128);

const uniforms = {
  uTime: { value: 0 },
  uRoughness: { value: 0.35 },
  uSeamWidth: { value: 0.025 },
};

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
});

const ball = new THREE.Mesh(geometry, material);
scene.add(ball);

// Interactive controls.
const settings = {
  rotationSpeed: 0.5,
  roughness: 0.35,
  seamWidth: 0.025,
  pause: false,
};

const gui = new GUI({ title: "Cricket Ball Controls" });

gui.add(settings, "rotationSpeed", 0, 2, 0.01)
  .name("Rotation speed");

gui.add(settings, "roughness", 0.05, 1, 0.01)
  .name("Leather roughness")
  .onChange((value: number) => {
    uniforms.uRoughness.value = value;
  });

gui.add(settings, "seamWidth", 0.005, 0.06, 0.001)
  .name("Seam width")
  .onChange((value: number) => {
    uniforms.uSeamWidth.value = value;
  });

gui.add(settings, "pause").name("Pause rotation");

const clock = new THREE.Clock();

function animate(): void {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  uniforms.uTime.value = clock.elapsedTime;

  if (!settings.pause) {
    ball.rotation.y += delta * settings.rotationSpeed;
    ball.rotation.x += delta * settings.rotationSpeed * 0.25;
  }

  renderer.render(scene, camera);
}

function resize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.uTime.value = clock.elapsedTime;
}

window.addEventListener("resize", resize);

animate();
