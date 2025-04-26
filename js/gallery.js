import {
  attributes,
  stats,
  specimenMockQuery,
  getSpecimenAssets,
} from "./utils/exampleSpecimen.js";
import {
  setQueryData,
  resourcePost,
  getPagination,
  setPagination,
} from "./utils/assetHandler.js";
import StateManager from "./utils/stateManager.js";

//====================
// GLOBAL METHODS
//====================
const state = new StateManager();
const collectionContainer = document.getElementById("cardCollection");
const filterSection = document.getElementById("filterContainer");
const searchInput = document.getElementById("searchInput");
const tabs = document.querySelectorAll(".quick-tabs-container .tab");
const prevPgBtn = document.getElementById("prevPgBtn");
const nextPgBtn = document.getElementById("nextPgBtn");
const modal_displayBtn = document.getElementById("displayBtn");
const modal_clsBtn = document.getElementById("modalCloseBtn");
modal_clsBtn.addEventListener("click", function () {
  closeSpecimenModal();
});

// ----- General ----- //
// sticky filter section
window.addEventListener("scroll", () => {
  const offset = filterSection.getBoundingClientRect().top;
  if (offset <= 0) {
    filterSection.style.backgroundColor = "var(--bgColor)";
  } else {
    filterSection.style.backgroundColor = "transparent";
  }
});

// setting all tabs with functionality
tabs.forEach((tab) => {
  const label = tab.querySelector("p");
  const tabname = label.textContent.trim().toLowerCase();
  tab.onclick = () => state.switchState(tabname);
});

function noBlockData() {
  console.log("ndblck");
  collectionContainer.innerHTML = `
  <div class="no-data-block">
      <h1>No Data Available...</h1>
  </div>`;
}

function initLoader() {
  collectionContainer.innerHTML = `
  <!-- From Uiverse.io by satyamchaudharydev --> 
    <div class="loadingimg">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>`;
}

function clearCollectionContainer() {
  collectionContainer.innerHTML = "";
  // collectionContainer.style.display = "block";
  return;
}

function updateContentCount(startFrom = 1, total = 1) {
  if (startFrom == 0) startFrom = 1;
  document.getElementById("contentCount").innerHTML = `${startFrom}/${total}`;
}

// Choose tab and highlight it */
function selectTabByName(tabName) {
  const tabs = document.querySelectorAll(".quick-tabs-container .tab");

  tabs.forEach((tab) => {
    tab.classList.remove("selected");
    const label = tab.querySelector("p");
    if (
      label &&
      label.textContent.trim().toUpperCase() === tabName.toUpperCase()
    ) {
      tab.classList.add("selected");
    }
  });
}

// Replace dropdown values
function replaceDropdownOptions(
  idName = "schSelector1",
  newName = "",
  newOptions = []
) {
  // Clear all existing options
  const schSelector = document.getElementById(idName);
  schSelector.style.display = "block";
  schSelector.innerHTML = "";

  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = newName.toUpperCase();
  defaultOption.disabled = true;
  defaultOption.selected = true;
  schSelector.appendChild(defaultOption);

  // Add new options
  newOptions.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.toLowerCase();
    option.textContent = opt.toUpperCase();
    schSelector.appendChild(option);
  });

  return schSelector;
}

function setPgButtons(stateName = "specimen") {
  const mem = state[`${stateName}Pagination`];
  if (!mem) throw new Error(`state.${stateName}Pagination Not Found.`);

  // setPrevBtn
  prevPgBtn.onclick = () => {
    mem.pgNumber--;

    // set global pagination
    setPagination({
      pageNumber: mem.pgNumber,
      pageLimit: mem.pgLimit,
    });

    // resubmit and populate
    submit(stateName);
  };

  //set nextBtn
  nextPgBtn.onclick = () => {
    mem.pgNumber++;

    // set global pagination
    setPagination({
      pageNumber: mem.pgNumber,
      pageLimit: mem.pgLimit,
    });

    // resubmit and populate
    submit(stateName);
  };
}

// Listen for key typing in the input field
let typeTimeout = null;
searchInput.addEventListener("input", function (event) {
  const inputValue = event.target.value;
  if (inputValue.length < 1)
    searchInput.style.backgroundImage = `url(../images/searchIcon.png)`;
  else searchInput.style.backgroundImage = "none";

  // on timout submit
  if (typeTimeout) clearTimeout(typeTimeout);
  typeTimeout = setTimeout(() => {
    setQueryData(state.currentState, { search: inputValue });
    submit(state.currentState);
  }, 2000);
});

// Optional: Listen for form submission (if you want to trigger it on form submit as well)
searchInput.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission
  const inputValue = event.target.value;

  setQueryData(state.currentState, { search: inputValue });
  submit(state.currentState);
});

async function submit(resource) {
  // get global pagination
  const pagination = getPagination();
  const { startFrom } = pagination;
  initLoader();

  console.log({ pagination });

  // pull data, well handle cache here
  const data = await resourcePost(resource); // handle error
  console.log(data);

  // protection
  if (startFrom > data.length) return;
  const endAt = startFrom > data.length ? data.length : startFrom;

  switch (resource) {
    case "specimen":
      // populate specimen - apply pagination
      populateSpecimen(data);
      updateContentCount(startFrom, data.length);
      console.log("submit:",resource)
      break;
    case "tokens":
      // populate tokens - apply pagination
      populateTokens(data);
      updateContentCount(startFrom, data.length);
      console.log("submit:",resource)
      break;
    case "owners":
      // populate owners - apply pagination
      populateOwners(data);
      updateContentCount(startFrom, data.length);
      console.log("submit:",resource)
      break;

    default:
      break;
  }
}

// ----- Specimen ----- //
const specimenModal = document.getElementById("modalContainer");
specimenModal.style.opacity = "0";
const specimenClasses = [
  "divine",
  "elemental",
  "gas",
  "undead",
  "humanoid",
  "plant",
  "beast",
  "fairy",
];

const specimenSkills = [
  "brawler",
  "arsenal",
  "cursed",
  "sorcerer",
  "mystical",
  "psychic",
  "quantum",
  "summoner",
];

function createSpecimenCard(specimenObj) {
  const { mugshot } = getSpecimenAssets(specimenObj);
  const imgUrl = mugshot.src;

  // Create card with loading state
  let newCard = document.createElement("div");
  newCard.className = "custom-card loading"; // add a 'loading' class

  // Load image first
  const img = new Image();
  img.src = imgUrl;

  img.onload = () => {
    // Once image is loaded, set it and remove 'loading'
    newCard.style.backgroundImage = `url(${imgUrl})`;
    newCard.classList.remove("loading");
  };

  img.onerror = () => {
    console.warn("Image failed to load:", imgUrl);
    // newCard.classList.remove("loading");
    // newCard.classList.add("error"); // optional error class
  };

  // Create card info
  let cardInfo = document.createElement("div");
  cardInfo.className = "card-info";

  let nameTxt = document.createElement("h3");
  nameTxt.textContent = specimenObj.name;

  let classTxt = document.createElement("p");
  classTxt.textContent = `Class: ${specimenObj.class || "unknown"}`;

  cardInfo.appendChild(nameTxt);
  cardInfo.appendChild(classTxt);
  newCard.appendChild(cardInfo);

  return newCard;
}

function createSpecimenModal(specimenObject) {
  showSpecimenModal();

  const { sid, name, description } = specimenObject;
  const { mugshot } = getSpecimenAssets(specimenObject);

  // Set the title
  document.getElementById("modalTitle").textContent = `#${sid} ${name}`;

  document.getElementById("displayBtn").onclick = () => {
    loadSpecimenDisplay(specimenObject.sid);
  };

  // Set the background image
  console.log(mugshot);
  document.getElementById(
    "modalImg"
  ).style.backgroundImage = `url(${mugshot.src})`;

  // Set the legend text
  document.getElementById("legendText").textContent = description;

  // Populate attributes
  const attributeContainer = document.getElementById("attributeContainer");
  attributeContainer.innerHTML = '<h3 class="sm-title">ATTRIBUTES</h3>'; // Reset and add header
  attributes.forEach((attr) => {
    let label = attr.includes("_") ? attr.replace("_", " ") : attr;
    let p = document.createElement("p");
    p.className = "stat_item";
    p.textContent = `${label}: ${specimenObject[attr]}`;
    attributeContainer.appendChild(p);
  });

  // Populate stats
  const statsContainer = document.getElementById("statsContainer");
  statsContainer.innerHTML = '<h3 class="sm-title">STATS</h3>'; // Reset and add header
  stats.forEach((stat) => {
    let label = stat.includes("_") ? stat.replace("_", " ") : stat;
    let p = document.createElement("p");
    p.className = "stat_item";
    p.textContent = `${label}: ${specimenObject[stat]}`;
    statsContainer.appendChild(p);
  });
}

function showSpecimenModal() {
  specimenModal.style.display = "block";
  specimenModal.style.opacity = "0";

  specimenModal.style.opacity = "1";
}

function closeSpecimenModal() {
  specimenModal.style.opacity = "0";
  setTimeout(() => {
    specimenModal.style.display = "none";
    specimenModal.style.opacity = "1";
  }, 300);
}

function populateSpecimen(data = []) {
  clearCollectionContainer();

  if (data.length === 0) noBlockData();
  collectionContainer.style.display = "flex";
  let resourceCount = 0;
  data.forEach((specimenData, i) => {
    // create card element
    const newCard = createSpecimenCard(specimenData);

    // give element an id
    newCard.id = `cardIndex${i}`;

    // add onclick to the card element
    newCard.onclick = () => {
      createSpecimenModal(specimenData);
    };

    // append element to collection container
    document.getElementById("cardCollection").appendChild(newCard);
    resourceCount++;
  });
}

// ----- Tokens ----- //
function populateTokens(data = []) {
  clearCollectionContainer();
  if (data.length === 0) noBlockData();
}

function populateOwners(data = []) {
  clearCollectionContainer();
  if (data.length === 0) noBlockData();

}

//====================
// STATE SETUP
//====================
state.setNewState(
  "specimen",
  // activate
  async function () {
    // clear collection container
    clearCollectionContainer();

    // highlight current tab
    selectTabByName("specimen");

    // assign state data
    state.specimenPagination = {
      pgLimit: 50,
      pgNumber: 1,
    };

    // build search container
    function handleSelectChange(event) {
      var selectedValue = event.target.value; // Get the selected value
      if (specimenClasses.includes(selectedValue)) {
        setQueryData("specimen", { class: selectedValue });
      } else if (specimenSkills.includes(selectedValue)) {
        setQueryData("specimen", { skill: selectedValue });
      }
    }

    // set select bar content
    const sel1 = replaceDropdownOptions(
      "schSelector1",
      "CLASS",
      specimenClasses
    );

    const sel2 = replaceDropdownOptions(
      "schSelector2",
      "SKILLS",
      specimenSkills
    );

    // set eventHandlers
    sel1.addEventListener("change", handleSelectChange);
    sel2.addEventListener("change", handleSelectChange);

    // obtain specimen list based on current query, for testing well do random
    submit("specimen", true);

    // activate the nextPage & previousPage UI
    setPgButtons("specimen");
  },
  // deactivate
  async function () {
    // remove all cards from the data-container
    // clear search container
    clearCollectionContainer();
  }
);

state.setNewState(
  "tokens",
  function () {
    // clear collection container
    clearCollectionContainer();

    // highlight current tab
    selectTabByName("tokens");

    // assign state data
    state.tokensPagination = {
      pgLimit: 50,
      pgNumber: 1,
    };

    // build search container
    replaceDropdownOptions("schSelector1", "CLASS", specimenClasses);
    replaceDropdownOptions("schSelector2", "DISCIPLINES", specimenSkills);

    // obtain token list based on current query, for testing we will do random
    state.pgNumber = 1;
    submit("tokens", true);

    // activate the nextPage & previousPage UI
    setPgButtons("tokens");
  },
  function () {
    // Remove all cards from the data-container
    clearCollectionContainer();
  }
);

state.setNewState(
  "owners",
  function () {
    // clear collection container
    clearCollectionContainer();

    // highlight current tab
    selectTabByName("owners");

    // assign state data
    state.ownersPagination = {
      pgLimit: 50,
      pgNumber: 1,
    };

    // build search container
    const sc1 = replaceDropdownOptions("schSelector1", "RANK", specimenClasses);
    const sc2 = replaceDropdownOptions("schSelector2");
    sc2.style.display = "none";
    sc1.classList.add("single");

    // obtain token list based on current query
    submit("owners", true);

    // activate the nextPage & previousPage UI
    setPgButtons("owners");
  },
  function () {
    // Remove all cards from the data-container
    clearCollectionContainer();
  }
);

// Finalize
state.switchState("specimen");
