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
import {
  attributes,
  stats,
  specimenMockQuery,
  getSpecimenAssets,
} from "./utils/exampleSpecimen.js";
const galleryContainer = document.querySelector(".gallery-content-container");
let totalCards = 0;
let totalOwners = 0;
let totalPlayers = 0;
const ownerData = [];
const playerData = [];
const specimenData = specimenMockQuery;

const rarityColors = {
  weak: "#CCCCCC",
  resistant: "#ADD8E6",
  strong: "#32CD32",
  mighty: "#0000CD",
  superMighty: "#800080",
  unpurgable: "#8B0000",
};

function reloadGallery(queryBody) {
  const content = queryBody.content || "specimen";

  // verify if the client even needs to fetch content
  let results = null;

  switch (content) {
    case "specimen":
      results = specimenData;
      // check if data needs to be fetched
      // populate gallery
      // update totals
      break;
    case "owners":
      results = ownerData;
      // check if data needs to be fetched
      // populate gallery
      break;
    case "players":
      results = playerData;
      // check if data needs to be fetched
      // populate gallery
      break;

    default:
      break;
  }

  // console.log({results});
  setResultsTxt(results.length, results.length);
}

function setResultsTxt(totalResults, totalShowing) {
  document.getElementById(
    "contentCount"
  ).textContent = `${totalResults}/${totalShowing}`;
}

function createSpecimenCard(indx = 0) {
  const content = specimenData[indx];
  const allRows = document.querySelectorAll(".card-collection");
  let currentRow = allRows[allRows.length - 1];
  const { mugshot } = getSpecimenAssets(content);

  console.log(content.name, mugshot);
  // Create new card
  let newCard = document.createElement("div");
  newCard.className = "custom-card";
  newCard.style.backgroundImage = `url(${mugshot.src})`; // Ensure background image is set with url()

  // Create card info
  let cardInfo = document.createElement("div");
  cardInfo.className = "card-info";
  let nameTxt = document.createElement("h3");
  nameTxt.textContent = content.name;
  let classTxt = document.createElement("p");
  classTxt.textContent = `Class: ${content.class}` || "uk";

  // Append elements to the card
  cardInfo.appendChild(nameTxt);
  cardInfo.appendChild(classTxt);
  newCard.appendChild(cardInfo);
  newCard.onclick = () => {
    createSpecimenModal(content);
  };
  currentRow.appendChild(newCard); // Add card to the current row

  // Update row and card count
  totalCards += 1;
}

// --- MODALS --- //
const cards = document.querySelectorAll(".custom-card");
const sections = document.querySelectorAll("section");
const clsModalBtn = document.getElementById("modalCloseBtn");
clsModalBtn.addEventListener("click", function () {
  closeModal();
});

// clear scroll
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

  const { sid, name, description } = specimenObject;
  const { mugshot } = getSpecimenAssets(specimenObject);

  // Set the title
  document.getElementById("modalTitle").textContent = `#${sid} ${name}`;

  // Set the background image
  document.getElementById("modalImg").style.backgroundImage = `url(${mugshot})`;

  // Set the legend text
  document.getElementById("legendText").textContent = description;

  // Populate attributes
  const attributeContainer = document.getElementById("attributeContainer");
  attributeContainer.innerHTML = '<h3 class="sm-title">ATTRIBUTES</h3><br />'; // Reset and add header
  attributes.forEach((attr) => {
    let label = attr.includes("_") ? attr.replace("_", " ") : attr;
    let p = document.createElement("p");
    p.className = "stat_item";
    p.textContent = `${label}: ${specimenObject[attr]}`;
    attributeContainer.appendChild(p);
  });

  // Populate stats
  const statsContainer = document.getElementById("statsContainer");
  statsContainer.innerHTML = '<h3 class="sm-title">STATS</h3><br />'; // Reset and add header
  stats.forEach((stat) => {
    let p = document.createElement("p");
    p.className = "stat_item";
    p.textContent = `${stat.label}: ${stat.value}`;
    statsContainer.appendChild(p);
  });
}

// run
createSpecimenCard();
createSpecimenCard(1);
createSpecimenCard(2);
createSpecimenCard(3);
createSpecimenCard();
createSpecimenCard(1);
createSpecimenCard(2);
