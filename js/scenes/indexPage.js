import {
  THREE,
  GLTFLoader,
} from "../../Display/js/threeEngine/threeWrapper.js";
const loader = new GLTFLoader();

// ==================== GEMS ==================== //
var gemScene, gemCamera, gemRenderer;
var currentGem = {};
var gemPause = false;

// Set up the gemScene
async function initGems() {
    const aspr = window.innerWidth / window.innerHeight;
    gemScene = new THREE.Scene();
    gemCamera = new THREE.PerspectiveCamera(75, aspr, 0.1, 1000);
    gemCamera.position.z = 5;
    gemRenderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById("gem-canvas"),
        alpha: true,
    });
    gemRenderer.setClearColor("#98fb98", 0); // background color
    gemRenderer.setSize(window.innerWidth, window.innerHeight);

    // Create a gemPrefab and add to the gemScene
    await setGem(0);
}

function animateGem() {
  requestAnimationFrame(animateGem);
  if (gemPause) return;

  // Rotate the gemPrefab
  if (currentGem.scene) {
    currentGem.scene.rotation.x += 0.01;
    currentGem.scene.rotation.y += 0.01;
  }

  gemRenderer.render(gemScene, gemCamera);
}

// Handle window resize
window.addEventListener("resize", function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  gemRenderer.setSize(width, height);
  gemCamera.aspect = width / height;
  gemCamera.updateProjectionMatrix();
});

async function updateGem(url) {
  // delete gemData if any
  console.log({ gemScene, l: currentGem.scene });
  gemScene.remove(currentGem.scene);

  // add gem data
  if (url) {
    const model = await loader.loadAsync(url);
    currentGem.scene = model.scene;
  } else {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: currentGem.color });
    currentGem.scene = new THREE.Mesh(geometry, material);
  }

  gemScene.add(currentGem.scene);
}

// SWAP CLASSES
var classIndex = 0;
const classesInfo = [
  {
    src: "./prefabs/chair.glb",
    name: "Divine",
    description:
      "Celestial, enigmatic being with heavenly traits beyond comprehension.",
    bgGradient: "linear-gradient(90deg, #ffcc00, #ff6666)",
    color: "#ffcc00",
  },
  {
    src: "./prefabs/chair02.glb",
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
    src: "./prefabs/chair.glb",
    name: "Beast",
    description: "Animalistic specimen displaying primal traits and instincts.",
    bgGradient: "linear-gradient(90deg, #ff3300, #ff9966)",
    color: "#ffcc00",
  },
  {
    src: "./prefabs/chair02.glb",
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
    src: "./prefabs/chair.glb",
    name: "Undead",
    description:
      "Reanimated, once-deceased entity often associated with immortality, malevolence, or decay.",
    bgGradient: "linear-gradient(90deg, #535353, #999999)",
    color: "#ffcc00",
  },
  {
    src: "./prefabs/chair02.glb",
    name: "Plant",
    description:
      "Organism composed partially or entirely of plant material, exhibiting botanical characteristics and traits.",
    bgGradient: "linear-gradient(90deg, #33cc33, #99ff99)",
    color: "#ffcc00",
  },
];

const prevGemBtn = document.getElementById("prevGemBtn");
const nextGemBtn = document.getElementById("nextGemBtn");
prevGemBtn.addEventListener("click", prevGem);
nextGemBtn.addEventListener("click", nextGem);

function nextGem() {
  const l = classesInfo.length;
  classIndex = classIndex < l - 1 ? classIndex + 1 : l - 1;
  setGem(classIndex);
}

function prevGem() {
  classIndex = classIndex < 0 ? classIndex - 1 : 0;
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
    nextGemBtn.style.opacity = ".2";
  } else if (classIndex <= 0) {
    prevGemBtn.style.opacity = ".2";
  } else {
    nextGemBtn.style.opacity = "1";
    prevGemBtn.style.opacity = "1";
  }
}
setOpacity();

function setGemDetails(name, description) {
  const gemName = document.getElementById("gemName");
  const gemDescription = document.getElementById("gemDescription");
  gemName.textContent = name;
  gemDescription.textContent = description;
}

function setGemBackground(bgStyle) {
  console.log({ bgStyle });
  document.getElementById("gem-canvas").style.background = bgStyle;
}

// ==================== CREATORS ==================== //
var creatorsScene,
  creatorsCamera,
  creatorsRenderer,
  creatorsContainer,
  chairModel;

var deltaTheta = 0,
  theta = 0,
  radius = 2,
  target;

function initChair() {
  // Set up the creatorsScene
  creatorsScene = new THREE.Scene();
  creatorsContainer = document.getElementById("footer-canvas");

  // Create a basic perspective creatorsCamera
  creatorsCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  creatorsCamera.position.z = 1;
  creatorsCamera.position.y = 1;

  // Create a creatorsRenderer with antialiasing and attach it to the canvas
  creatorsRenderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: creatorsContainer,
    alpha: true,
  });

  updateSize();

  // Call this function where you need to start loading the model
  const model = "./prefabs/chair02.glb";
  loader.load(
    model,
    function (gltf) {
      chairModel = gltf.scene;
      creatorsScene.add(gltf.scene);
      console.log({ rot: chairModel.rotation.y });

      // creatorsCamera lock on
      const chairPos = chairModel.position.clone();
      chairPos.y += 0.5;
      target = chairPos;
      creatorsCamera.lookAt(chairPos);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  // Add directional light to the creatorsScene
  var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1); // Set position of light
  creatorsScene.add(directionalLight); // Add light to creatorsScene
}

function updateSize() {
  // Get new size
  const width = creatorsContainer.clientWidth;
  const height = creatorsContainer.clientHeight;

  // Update creatorsCamera
  creatorsCamera.aspect = width / height;
  creatorsCamera.updateProjectionMatrix();

  // Update creatorsRenderer
  creatorsRenderer.setSize(width, height);
  creatorsRenderer.setPixelRatio(window.devicePixelRatio);
}

var chairPause = false;
function animateChair() {
  requestAnimationFrame(animateChair);
  if (chairPause) return;

  // Rotate the cube
  rotateAroundChair();
  creatorsRenderer.render(creatorsScene, creatorsCamera);
}

function rotateAroundChair() {
  if (!chairModel) return;

  // Update the position of the creatorsCamera for orbiting
  deltaTheta = 0.01; // Example angular speed, adjust as needed
  theta += deltaTheta;

  // Calculate new position based on angle
  var newX = target.x + radius * Math.cos(theta);
  var newZ = target.z + radius * Math.sin(theta);

  // Set the new position of the creatorsCamera
  creatorsCamera.position.set(newX, 1, newZ);
  creatorsCamera.lookAt(target); // Make sure creatorsCamera is always looking at the target
}

// Handle window resize
window.addEventListener("resize", function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  creatorsRenderer.setSize(width, height);
  creatorsCamera.aspect = width / height;
  updateSize();
  creatorsCamera.updateProjectionMatrix();
});

//Run
const gemElem = document.getElementById("gemSection");
const creatorsElem = document.getElementById("last_section");
function handleAnims(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target === gemElem) {
        console.log("Gem Container is in the viewport.xxx ");
        gemPause = false;
        animateGem();
      } else if (entry.target === creatorsElem) {
        console.log("Creators Container is in the viewport.xxx");
        chairPause = false;
        animateChair();
      }
    } else {
      if (entry.target === gemElem) {
        gemPause = true;
        console.log("Gem Container has left the viewport.000");
      } else if (entry.target === creatorsElem) {
        chairPause = true;
        console.log("Creators Container has left the viewport.000");
      }
    }
  });
}

const observerOptions = {
  root: null, // Use the viewport as the root
  threshold: 0.1, // Trigger when 10% of the element is visible
};

const observer = new IntersectionObserver(handleAnims, observerOptions);
observer.observe(gemElem);
observer.observe(creatorsElem);

initGems();
animateGem();
initChair();
animateChair();
