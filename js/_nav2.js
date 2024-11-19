// NAVBAR ANIMATIONS
const navbar = document.getElementById("navbar");
const overlay = document.getElementById("navOverlay");
const overlayCloseBtn = document.getElementById("overlayCloseBtn");
let navStatus = false;

// TOGGLE NAV BUTTONS
function toggleNav() {
  if (navStatus) {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
    navStatus = false;
  } else {
    navbar.classList.add("active");
    overlay.classList.add("active");
    navStatus = true;
  }
}

navbar.addEventListener("click", toggleNav);
overlayCloseBtn.addEventListener("click", toggleNav);
console.log("nav loaded");