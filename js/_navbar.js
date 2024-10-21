const closeBtn = document.getElementById("closeBtn");
const toggleNavButton = document.getElementById("toggleNavButton");
const sidePanel = document.getElementById("sidePanel");
var panelOpen = sidePanel.classList.contains("open");

// Function to toggle the side panel
function toggleSidePanel() {
  sidePanel.classList.toggle("open");
  panelOpen = sidePanel.classList.contains("open");
  // if (!panelOpen) sidePanel.style.display = "none";
  // else sidePanel.style.display = "block";
}

// Add click event listener to the button
toggleNavButton.addEventListener("click", toggleSidePanel);
closeBtn.addEventListener("click", toggleSidePanel);