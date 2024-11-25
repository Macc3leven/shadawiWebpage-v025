import { THREE, GLTFLoader } from "../threeEngineV1/threeWrapper.js";
const loader = new GLTFLoader();

// elements
const gem_scene_area = document.getElementById("section4");
const gem_canvas = document.getElementById("gemsCanvas");
const previous_gem_button = document.getElementById("prevGemBtn");
const next_gem_btn = document.getElementById("nextGemBtn");
const gem_name = document.getElementById("gemName");
const gem_description = document.getElementById("gemDescription");

// sceneObject
var currentGem = {};
const scne = {
  scene: null,
  camera: null,
  renderer: null,
  paused: false,
  modelCache: null,
  init: null,
  container: gem_scene_area,
};

// Set up the scne.scene
scne.init = async function initGems() {
  const aspr = window.innerWidth / window.innerHeight;
  scne.scene = new THREE.Scene();
  scne.camera = new THREE.PerspectiveCamera(75, aspr, 0.1, 1000);
  scne.camera.position.z = 5;
  scne.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: gem_canvas,
    alpha: true,
  });
  scne.renderer.setClearColor("#98fb98", 0); // background color
  scne.renderer.setSize(window.innerWidth, window.innerHeight);

  // Create a gemPrefab and add to the scne.scene
  await setGem(0);
  animateGem();
};

function animateGem() {
  requestAnimationFrame(animateGem);
  if (scne.paused) return;

  // Rotate the gemPrefab
  if (currentGem.model) {
    currentGem.model.rotation.y += 0.01;
  }

  scne.renderer.render(scne.scene, scne.camera);
}

// Handle window resize
scne.resize = function (windowWidth, windowHeight) {
  var width = windowWidth;
  var height = windowHeight;
  scne.renderer.setSize(width, height);
  scne.camera.aspect = width / height;
  scne.camera.updateProjectionMatrix();
};

async function updateGem(url) {
  // delete gemData if any
  console.log({ scne, l: currentGem.model });
  scne.scene.remove(currentGem.model);

  // add gem data
  if (url) {
    const model = await loader.loadAsync(url);
    currentGem.model = model.scene;
  } else {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: currentGem.color });
    currentGem.model = new THREE.Mesh(geometry, material);
  }

  if (scne.modelCache) scne.scene.remove(scne.modelCache);
  scne.scene.add(currentGem.model);
  scne.modelCache = currentGem.model;
}

// SWAP CLASSES
var classIndex = 0;
const classesInfo = [
  {
    src: "./prefabs/gem-undead.glb",
    name: "Divine",
    description:
      "Celestial, enigmatic being with heavenly traits beyond comprehension.",
    bgGradient: "linear-gradient(90deg, #ffcc00, #ff6666)",
    color: "#ffcc00",
  },
  {
    src: "./prefabs/gem-undead.glb",
    name: "Gas",
    description:
      "Gas classified specimen are usually have a body with a fume-like texture.",
    bgGradient: "linear-gradient(90deg, #6151db, #af89ff)",
    color: "#ffcc00",
  },
  {
    src: "./prefabs/cloud-ogre-browser.glb",
    name: "Humanoid",
    description: "Bipedal, upright creature capable of walking on two legs.",
    bgGradient: "linear-gradient(90deg, #996633, #cc9966)",
    color: "#ffcc00",
  },
  {
    src: "./prefabs/gem-undead.glb",
    name: "Beast",
    description: "Animalistic specimen displaying primal traits and instincts.",
    bgGradient: "linear-gradient(90deg, #ff3300, #ff9966)",
    color: "#ffcc00",
  },
  {
    src: "./prefabs/gem-undead.glb",
    name: "Fairy",
    description:
      "Petite, magical humanoid often depicted with wings and mischievous tendencies, tied to nature.",
    bgGradient: "linear-gradient(90deg, #ff99ff, #ffccff)",
    color: "#ffcc00",
  },
  {
    src: "./prefabs/cloud-ogre-browser.glb",
    name: "Elemental",
    description:
      "Powerful entity embodying the essence of natural elements such as fire, water, earth, or air.",
    bgGradient: "linear-gradient(90deg, #6699ff, #ccccff)",
    color: "#ffcc00",
  },
  {
    src: "./prefabs/gem-undead.glb",
    name: "Undead",
    description:
      "Reanimated, once-deceased entity often associated with immortality, malevolence, or decay.",
    bgGradient: "linear-gradient(90deg, #535353, #999999)",
    color: "#ffcc00",
  },
  {
    src: "./prefabs/gem-undead.glb",
    name: "Plant",
    description:
      "Organism composed partially or entirely of plant material, exhibiting botanical characteristics and traits.",
    bgGradient: "linear-gradient(90deg, #33cc33, #99ff99)",
    color: "#ffcc00",
  },
];

// Buttons for changing gems
previous_gem_button.onclick = prevGem;
next_gem_btn.onclick = nextGem;

function nextGem() {
  const l = classesInfo.length;
  classIndex = classIndex < l - 1 ? classIndex + 1 : l - 1;
  setGem(classIndex);
}

function prevGem() {
  classIndex = classIndex > 0 ? (classIndex -= 1) : 0;
  setGem(classIndex);
}

async function setGem(classIndex) {
  const _gem = classesInfo[classIndex];
  currentGem = _gem;

  // change name in Ui
  setGemDetails(_gem.name, _gem.description);

  // change background color
  setGemBackground(_gem.bgGradient);

  // change gem in 3js
  await updateGem(_gem.src);

  console.log({ classIndex, gemClass: _gem.name });
  setOpacity();
}

function setOpacity() {
  if (classIndex >= classesInfo.length - 1) {
    next_gem_btn.style.opacity = ".2";
    next_gem_btn.onclick = () => {};
  } else if (classIndex <= 0) {
    previous_gem_button.style.opacity = ".2";
    previous_gem_button.onclick = () => {};
  } else {
    next_gem_btn.style.opacity = "1";
    previous_gem_button.style.opacity = "1";
    previous_gem_button.onclick = prevGem;
    next_gem_btn.onclick = nextGem;
  }
}
setOpacity();

function setGemDetails(name, description) {
  gem_name.textContent = name;
  gem_description.textContent = description;
}

function setGemBackground(bgStyle) {
  console.log({ bgStyle });
  gem_scene_area.style.background = bgStyle;
}

scne.onObserve = function (entry, observer) {
  if (entry !== gem_scene_area) return;


  if (entry.isIntersecting) {
    console.log("Gem Container is in the viewport ");
    scne.paused = false;
    animateGem();
  } else {
    scne.paused = true;
    console.log("Gem Container has left the viewport.000");
  }
};

export default scne;
