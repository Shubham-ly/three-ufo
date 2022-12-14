import "./style.css";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  HemisphereLightHelper,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
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

scene.background = new Color().setHSL(0.5, 0.05, 0.6);
scene.fog = new Fog(scene.background, 1, 500);
const dirLight = new DirectionalLight(0xffffff, 1);
dirLight.color.setHSL(0.1, 1, 0.95);
dirLight.position.set(-1, 1.75, 1);
dirLight.position.multiplyScalar(40);
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

dirLight.castShadow = true;
const groundGeo = new PlaneGeometry(10000, 10000);
const groundMat = new MeshLambertMaterial({ color: 0xffffff });
groundMat.color.setHSL(0.095, 1, 0.75);

const ground = new Mesh(groundGeo, groundMat);
// ground.position.y = -33;
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const loader = new GLTFLoader();
// let ufo: null | Group = null;
let cycle: null | Group = null;
loader.load(
  "/cycle.glb",
  (gltf) => {
    cycle = gltf.scene;
    cycle.rotation.y = -90;
    cycle.position.y = -0.5;
    // cycle.scale.set(0.1, 0.1, 0.1);
    scene.add(cycle);
  },
  undefined,
  (e) => console.error(e)
);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);

function animation(_time: number) {
  // if (cycle) {
  //   cycle.rotation.y += 0.01;
  // }
  renderer.render(scene, camera);
}

document.body.appendChild(renderer.domElement);
// const speed = 0.05;
// document.addEventListener("keydown", (e) => {
//   if (!cycle) return;
//   if (e.key === "w") ufo.position.y += speed;
//   else if (e.key === "s") ufo.position.y -= speed;

//   if (e.key === "a") ufo.position.x -= speed;
//   else if (e.key === "d") ufo.position.x += speed;
// });
let lastScroll = 0;
document.addEventListener("scroll", (e) => {
  e.preventDefault();
  let st = window.pageYOffset || document.documentElement.scrollTop;
  const rotationAmount = window.scrollY * 0.0005;
  if (st > lastScroll) {
    if (cycle) cycle.rotation.y += rotationAmount;
  } else {
    if (cycle) cycle.rotation.y -= rotationAmount;
  }
  lastScroll = st <= 0 ? 0 : st;
});
