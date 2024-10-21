import { THREE, OrbitControls } from "../../Display/js/threeEngine/threeWrapper";
import ThreeMemory from "../../Display/js/threeEngine/threeMemory.js";
import * as Camera from "../../Display/js/threeEngine/camera.js";
import * as Prefabs from "../../Display/js/threeEngine/prefabs.js";
import * as Terrain from "../../Display/js/threeEngine/terrain.js";
import * as Lights from "../../Display/js/threeEngine/lights.js";
import * as Actions from "../../Display/js/threeEngine/actions.js";


const memory = new ThreeMemory();
const characterDataname = "gloud_ogre";
const characterGlbLocation = "./prefabs/cloud-ogre-browser.glb"; // "https://beige-worthwhile-hornet-694.mypinata.cloud/ipfs/Qmaqqq4Br8svznZVpCrH27HcRa61VUsqPHy23eaYxW5caG/prefab_1000.glb"//"./models/cloud-ogre-browser.glb";

// Manually Init Scene
const container = document.getElementById("myScene");
memory.Scene = new THREE.Scene();
memory.Clock = new THREE.Clock();

memory.Renderer = new THREE.WebGLRenderer({ antialias: true });
memory.Renderer.setPixelRatio(window.devicePixelRatio);
memory.Renderer.setSize(window.innerWidth, window.innerHeight);
memory.Renderer.shadowMap.enabled = true;
memory.Renderer.shadowMap.type = THREE.PCFShadowMap;
container.appendChild(memory.Renderer.domElement);
memory.Canvas = memory.Renderer.domElement;

// Initialize Camera
const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 1.0;
const far = 100;
memory.ClientCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
memory.ClientCamera.position.set(3.05, 2.9, 1.3); // Initial position
memory.Controls = new OrbitControls(
  memory.ClientCamera,
  memory.Renderer.domElement
);

// Configure OrbitControls for limited interaction
memory.Controls.enablePan = false; 
memory.Controls.enableZoom = false;
memory.Controls.enableRotate = false;
memory.Controls.target.set(0, 2, 1.3);
memory.Controls.update();

// Animation logic for continuous rotation
let angle = 0;
let direction = 1; // 1 for forward, -1 for backward
let wind = 8;
let windDirection = 0.015;
let prefabMixer = null;
function animate() {
  requestAnimationFrame(animate);

  // Calculate new position
  angle += direction * 0.003; // Speed of rotation
  if (angle >= Math.PI || angle <= 0) direction *= -1; // Reverse the direction at the extremes
  memory.ClientCamera.position.x = 3 + 1 * Math.sin(angle); // Adjust the radius and offset to match desired path
  memory.ClientCamera.position.z = 1.3 + 2 * Math.cos(angle);
  memory.ClientCamera.lookAt(memory.Controls.target);

  // Move fog
  if (wind >= 8 || wind <= 4) windDirection *= -1;
  wind += windDirection;
  Terrain.setFog(memory, { color: "#4B605C", near: 1, far: wind });

  // USE ANIMATIONS
  if (prefabMixer) {
    const mixerUpdateDelta = memory.Clock.getDelta();
    prefabMixer.update(mixerUpdateDelta);
  }

  memory.Renderer.render(memory.Scene, memory.ClientCamera);
}
animate();

// Call this function to resize the renderer upon window resize
function initWindowResize(camera, renderer) {
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
initWindowResize(memory.ClientCamera, memory.Renderer);

Camera.setCameraPosition(memory, 3.05, 2.9, 1.3);
Camera.setCameraTarget(memory, 0, 2, 1.3);

// add terrain
Terrain.setBackground(memory, "#4B605C");
Terrain.setFog(memory, { color: "#8AA39E", near: 1, far: 8 });

// add character
const specPrefabData = await Prefabs.addModel(
  memory,
  characterDataname,
  characterGlbLocation
);


//Testing anims
console.log(specPrefabData.baseActions);

function mintAction(mintAmount = 1) {
  prefabMixer = specPrefabData.mixer; //enable animations
  const MintActionName = Object.keys(specPrefabData.baseActions)[0];
  Actions.repeatAnimation(specPrefabData, MintActionName, mintAmount);
}

// setTimeout(mintAction, 3000);

// Lights
// Glow.initGlow(memory);
const lightDataNames = [];
const allLights = [
  {
    //light1: face
    type: "PointLight",
    color: 0xffffff,
    intensity: 0,
    position: { x: 2, y: 2, z: 2 },
    distance: 100,
    decay: 1,
  },
  {
    //light2:
    type: "PointLight",
    color: 0xffffff,
    intensity: 4,
    position: { x: -4, y: 6, z: 10 },
    distance: 300,
    decay: 1,
  },
  {
    //light3:
    type: "PointLight",
    color: 0x9501a6,
    intensity: 1,
    position: { x: 1, y: 6, z: -1 },
    distance: 300,
    decay: 1,
  },
];

allLights.forEach((lightObject, index) => {
  lightObject.scene = Lights.createLight(lightObject);
  const { x, y, z } = lightObject.position;
  lightObject.scene.position.set(x, y, z);
  lightObject.dataname = lightObject.type + `_${index}`;

  lightDataNames.push(lightObject.dataname);
  Lights.saveLightData(memory, lightObject);
});


console.log(memory.Scene.children, typeof memory.Scene.children)

// Export
window.mintAction = mintAction;