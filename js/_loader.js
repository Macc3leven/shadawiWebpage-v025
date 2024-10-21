var progression = 0;
var progressInterval = setInterval(forceProgress, 100);

// Function to monitor the loading of various elements
function monitorLoadingProgress() {
  console.log("Loading...");

  function pushProgress(amount, dataname) {
    progression += amount;
    if (dataname) console.log("loaded: " + dataname);
  }

  // Create a promise for each image loading
  const imagePromises = Array.from(document.images).map((img) => {
    if (img.complete) {
      console.log("image loaded fast.");
      pushProgress(1);
    } else {
      img.addEventListener("load", pushProgress(1, "img"));
      img.addEventListener("error", pushProgress(0)); // Resolve even if there is an error
    }
  });

  // For Three.js canvases, we assume you have a custom event that fires when loading is done
    const gemCanvas = document.getElementById("gem-canvas");
    if(gemCanvas) gemCanvas.addEventListener("loaded", pushProgress(10, "gem canvas"));

  const footerCanvas = document.getElementById("footer-canvas");
  if(footerCanvas)
    footerCanvas.addEventListener("loaded", pushProgress(10, "footer canvas"));

  // For the iframe, listen for the 'load' event
    const iframe = document.getElementById("builds-scene");
    if(iframe) iframe.addEventListener("load", pushProgress(10, "build scene"));
}

// Execute the function with the elements to monitor
console.log("WOOO")
monitorLoadingProgress();

// Update the progress
function updateProgressBar(progress) {
  document.querySelector("#loadingProgress > div").style.width = `${progress}%`;
  if (progress > 98) {
    openPage();
  }
}

function openPage() {
  clearInterval(progressInterval);
  document.getElementById("loadingScreen").style.display = "none";
//   document.getElementById("hero-title").classList.add("rising-text");
  console.log("page successfully loaded");
}

async function forceProgress() {
  progression += 25;
  updateProgressBar(progression);
}
