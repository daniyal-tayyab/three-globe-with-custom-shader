import * as Three from "three";
import gsap from "gsap";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
import atmosphereFragmemntShader from "./shaders/atmosphereFragment.glsl";

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new Three.WebGLRenderer({
  antialias: true,
  // canvas: document.querySelector("canvas"),
}); // 3- antialias true will sharpen the render

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // 3- sharpen the render / high resolution render
document.body.appendChild(renderer.domElement);

// 4- install vite-plugin-string

const geometry = new Three.SphereGeometry(5, 50, 50); // radius, width segment, height segment
// const material = new Three.MeshBasicMaterial({
//   map: new Three.TextureLoader().load("./img/globe.jpg"), // 2- map a texture onto globe
// });
const material = new Three.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    // for passing globe texture to shaders
    globeTexture: {
      value: new Three.TextureLoader().load("./img/globe.jpg"),
    },
  },
});

// 1- create sphere
const sphere = new Three.Mesh(geometry, material);

// scene.add(sphere);

// for big blue atmosphere
const bigBlueMaterial = new Three.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmemntShader,
  blending: Three.AdditiveBlending,
  side: Three.BackSide,
});

const atmosphere = new Three.Mesh(geometry, bigBlueMaterial);
atmosphere.scale.set(1.1, 1.1, 1.1);

scene.add(atmosphere);

const group = new Three.Group();
group.add(sphere);
scene.add(group);

const startGeometry = new Three.BufferGeometry();
const startMaterial = new Three.PointsMaterial({
  color: 0xffffff,
});

const startVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 2000;
  startVertices.push(x, y, z);
}

startGeometry.setAttribute(
  "position",
  new Three.Float32BufferAttribute(startVertices, 3)
);

const stars = new Three.Points(startGeometry, startMaterial);

scene.add(stars);

camera.position.z = 15;

const mouse = {
  x: undefined,
  y: undefined,
};

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.003;
  sphere.rotation.x += 0.003;
  // group.rotation.y = mouse.x * 0.5;
  gsap.to(group.rotation, {
    x: -mouse.y * 0.5,
    y: mouse.x * 0.5,
    duration: 2,
  });
  renderer.render(scene, camera);
}

animate();

addEventListener("mousemove", () => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});

// shader has two functoins 1- vertex shader 2- texture shader of language glsl
// vertex shader is a function that is run for every vertex within our geometry
