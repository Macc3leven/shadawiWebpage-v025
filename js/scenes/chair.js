import {
    THREE,
    GLTFLoader,
  } from "../threeEngineV1/threeWrapper.js";
  const loader = new GLTFLoader();

// ==================== CREATORS ==================== //
const chair_canvas_area = document.getElementById("footerContainer");
const chair_canvas = document.getElementById("footerCanvas");
const chairModelSrc = "./prefabs/chair02.glb";
const scne = {
    scene: null,
    camera: null,
    renderer: null,
    paused: false,
    modelCache: null,
    init: null,
    container: chair_canvas_area
  };

var deltaTheta = 0,
  theta = 0,
  radius = 2,
  target;

scne.init = function initChair() {
  // Set up the scne.scene
  scne.scene = new THREE.Scene();

  // Create a basic perspective scne.camera
  scne.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  scne.camera.position.z = 1;
  scne.camera.position.y = 1;

  // Create a scne.renderer with antialiasing and attach it to the canvas
  scne.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: chair_canvas,
    alpha: true,
  });

  updateSize();

  // Call this function where you need to start loading the model
  loader.load(
    chairModelSrc,
    function (gltf) {
      scne.modelCache = gltf.scene;
      scne.scene.add(scne.modelCache);
      
      // scne.camera lock on
      const chairPos = scne.modelCache.position.clone();
      chairPos.y += 0.5;
      target = chairPos;
      scne.camera.lookAt(chairPos);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  // Add directional light to the scne.scene
  var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1); // Set position of light
  scne.scene.add(directionalLight); // Add light to scne.scene
  animateChair();
}

function updateSize() {
  // Get new size
  const width = chair_canvas_area.clientWidth;
  const height = chair_canvas_area.clientHeight;

  // Update scne.camera
  scne.camera.aspect = width / height;
  scne.camera.updateProjectionMatrix();

  // Update scne.renderer
  scne.renderer.setSize(width, height);
  scne.renderer.setPixelRatio(window.devicePixelRatio);
}

function animateChair() {
  requestAnimationFrame(animateChair);
  if (scne.paused) return;

  // Rotate the cube
  rotateAroundChair();
  scne.renderer.render(scne.scene, scne.camera);
}

function rotateAroundChair() {
  if (!scne.modelCache) return;

  // Update the position of the scne.camera for orbiting
  deltaTheta = 0.01; // Example angular speed, adjust as needed
  theta += deltaTheta;

  // Calculate new position based on angle
  var newX = target.x + radius * Math.cos(theta);
  var newZ = target.z + radius * Math.sin(theta);

  // Set the new position of the scne.camera
  scne.camera.position.set(newX, 1, newZ);
  scne.camera.lookAt(target); // Make sure scne.camera is always looking at the target
}

// Handle window resize
scne.resize = function (width, height) {
  scne.renderer.setSize(width, height);
  scne.camera.aspect = width / height;
  updateSize();
  scne.camera.updateProjectionMatrix();
};

scne.onObserve = function (entry, observer) {
  if (entry !== gem_scene_area) return;


  if (entry.isIntersecting) {
    console.log("Gem Container is in the viewport ");
    scne.paused = false;
    animateChair();
  } else {
    scne.paused = true;
    console.log("Gem Container has left the viewport.000");
  }
};

export default scne;