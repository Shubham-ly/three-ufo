import "./style.css";
import {
  Group,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const camera = new PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  10
);
camera.position.z = 2;
const scene = new Scene();
const light = new PointLight(0xffffff, 50);
light.position.z = 10;
camera.add(light);
const secondLight = new PointLight(0xffffff, 10);
secondLight.position.set(0, -20, 30);
scene.add(secondLight);

const loader = new GLTFLoader();
let ufo: null | Group = null;
loader.load(
  "/ufo.glb",
  (gltf) => {
    ufo = gltf.scene;
    ufo.scale.set(0.1, 0.1, 0.1);
    scene.add(ufo);
  },
  undefined,
  (e) => console.error(e)
);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);

function animation(_time: number) {
  if (ufo) {
    ufo.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

document.body.appendChild(renderer.domElement);
const speed = 0.05;
document.addEventListener("keydown", (e) => {
  if (!ufo) return;
  if (e.key === "w") ufo.position.y += speed;
  else if (e.key === "s") ufo.position.y -= speed;

  if (e.key === "a") ufo.position.x -= speed;
  else if (e.key === "d") ufo.position.x += speed;
});
document.addEventListener("scroll", (e) => {
  e.preventDefault();
  const scaleAmount = window.scrollY * 0.01;
  ufo?.scale.set(scaleAmount, scaleAmount, scaleAmount);
});
