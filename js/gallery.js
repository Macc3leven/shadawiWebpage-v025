import {
  attributes,
  stats,
  specimenMockQuery,
  getSpecimenAssets,
} from "./utils/exampleSpecimen.js";
import { getData, saveData, removeData } from "./utils/storage.js";
import { specimenQuery } from "./utils/assetHandler.js";

// === SPECIMEN SEARCH FILTERS === //
const queryBody = {
  content: "specimen",
  skill: null,
  class: null,
  search: null,
  totalQueryResults: 10,
};

// Handle Tabs
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    const i = index;

    // Remove 'active' class from all tabs
    tabs.forEach((t) => (t.className = "tab"));
    tabs[i].className = "tab selected";
    const tabName = tabs[i].children[0].textContent.toLocaleLowerCase();
    queryBody.content = tabName;

    // reload gallery
    cleanGallery();
    reloadGallery(queryBody);
  });
});

// Handle filters
function handleSelectChange(event) {
  var selectedValue = event.target.value; // Get the selected value
  console.log("Selected value:", selectedValue);
  console.log("Selected ID:", event.target.id);

  // Add your custom logic here
  switch (event.target.id) {
    case "specimenSkillSelect":
      queryBody.skill = selectedValue;
      break;
    case "specimenClassSelect":
      queryBody.class = selectedValue;
      break;

    default:
      break;
  }
}

var specimenClassSelect = document.getElementById("specimenClassSelect");
var specimenSkillSelect = document.getElementById("specimenSkillSelect");
specimenClassSelect.addEventListener("change", handleSelectChange);
specimenSkillSelect.addEventListener("change", handleSelectChange);

// Search bar
const searchInput = document.getElementById("searchInput");
var autoSubmissionTime = 1200;
var timeoutId;

function handleInput(value) {
  console.log("Input value: ", value);
  if (value.length < 1)
    searchInput.style.backgroundImage = `url(../images/searchIcon.png)`;
  // Add your desired functionality here (e.g., making API calls)
}

// Function to handle input events with a delay of 1.2 seconds
function onInputChange(inputValue) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(function () {
    handleInput(inputValue);
  }, autoSubmissionTime); // 1.2 seconds delay
}

// Listen for key typing in the input field
searchInput.addEventListener("input", function (event) {
  const inputValue = event.target.value;
  searchInput.style.backgroundImage = "none";

  onInputChange(inputValue); // Call the debounced function with the input value
});

// Optional: Listen for form submission (if you want to trigger it on form submit as well)
searchInput.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission
  const inputValue = event.target.value;

  handleInput(inputValue); // Perform the function immediately on submit
});

// === GALLERY DATA === //
const galleryContainer = document.querySelector(".gallery-content-container");
const collections = [
  "specimenCollection",
  "ownersCollection",
  "playersCollection",
];
let totalCards = 0;
let totalOwners = 0;
let totalPlayers = 0;
let ownerData = [];
let playerData = [];
let specimenData = specimenMockQuery;

const rarityColors = {
  weak: "#CCCCCC",
  resistant: "#ADD8E6",
  strong: "#32CD32",
  mighty: "#0000CD",
  superMighty: "#800080",
  unpurgable: "#8B0000",
};

function noGalleryData(galleryIndex = 0) {
  const elementName = collections[galleryIndex];
  document.getElementById(elementName).innerHTML = `<div class="no-data-block">
                <h1>No Data Available...</h1>
            </div>`;
}

function cleanGallery() {
  collections.forEach((c) => {
    const elem = document.getElementById(c);
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  });
}

async function reloadGallery(queryBody) {
  const content = queryBody.content || "specimen";

  // verify if the client even needs to fetch content
  let results = null;

  switch (content) {
    case "specimen":
      // check if data needs to be fetched
      results = specimenData; // await specimenQuery(queryBody);

      // populate gallery
      if (results.length > 0) {
        results.forEach((spec) => {
          createSpecimenCard(spec);
        });
      } else noGalleryData(0);

      // update data
      specimenData = results;
      break;
    case "owners":
      // check if data needs to be fetched
      results = ownerData; // await specimenQuery(queryBody);

      // populate gallery
      if (results.length > 0) {
        results.forEach((spec) => {
          createSpecimenCard(spec);
        });
      } else noGalleryData(0);

      // update data
      ownerData = results;
      break;
    case "players":
      // check if data needs to be fetched
      results = playerData; // await specimenQuery(queryBody);

      // populate gallery
      if (results.length > 0) {
        results.forEach((spec) => {
          createSpecimenCard(spec);
        });
      } else noGalleryData(0);

      // update data
      playerData = results;
      break;

    default:
      break;
  }

  console.log({results});
  setResultsTxt(results.length, results.length);
}

function setResultsTxt(totalResults, totalShowing) {
  document.getElementById(
    "contentCount"
  ).textContent = `${totalResults}/${totalShowing}`;
}

function createSpecimenCard(specimenObj) {
  const allRows = document.querySelectorAll(".card-collection");
  let currentRow = allRows[allRows.length - 1];
  const { mugshot } = getSpecimenAssets(specimenObj);

  console.log(specimenObj.name, mugshot);
  // Create new card
  let newCard = document.createElement("div");
  newCard.className = "custom-card";
  newCard.style.backgroundImage = `url(${mugshot.src})`; // Ensure background image is set with url()

  // Create card info
  let cardInfo = document.createElement("div");
  cardInfo.className = "card-info";
  let nameTxt = document.createElement("h3");
  nameTxt.textContent = specimenObj.name;
  let classTxt = document.createElement("p");
  classTxt.textContent = `Class: ${specimenObj.class}` || "uk";

  // Append elements to the card
  cardInfo.appendChild(nameTxt);
  cardInfo.appendChild(classTxt);
  newCard.appendChild(cardInfo);
  newCard.onclick = () => {
    createSpecimenModal(specimenObj);
  };
  currentRow.appendChild(newCard); // Add card to the current row

  // Update row and card count
  totalCards += 1;
}

function createOwnerBlock(ownerObj) {}
function createPlayerBlock(ownerObj) {}

// --- MODALS --- //
const cards = document.querySelectorAll(".custom-card");
const sections = document.querySelectorAll("section");
const clsModalBtn = document.getElementById("modalCloseBtn");
const displayBtn = document.getElementById("displayBtn");
clsModalBtn.addEventListener("click", function () {
  closeModal();
});

function showModal() {
  sections.forEach((el) => {
    if (el.id != "modalContainer") {
      el.style.display = "none";
    } else el.style.display = "block";
  });
}

function closeModal() {
  sections.forEach((el) => {
    if (el.id == "modalContainer") {
      el.style.display = "none";
    } else el.style.display = "block";
  });
}

function createSpecimenModal(specimenObject) {
  showModal();
  saveData("currentSpecimenId", specimenObject.sid);

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

// --- DISPLAY --- //
function loadSpecimenDisplay(sid) {
  // get all forms of current sid
}

// run
let i = 0;
while (i < 8) {
  const spec = specimenData[i % specimenData.length];
  createSpecimenCard(spec);
  i++;
}
