import "./_nav2.js";
import "./_scroller.js";
import Gems from "./scenes/gems.js";
import Chair from "./scenes/chair.js";

Gems.init();
Chair.init();

//handle canvas resizing
window.addEventListener("resize", function () {
  var width = window.innerWidth;
  var height = window.innerHeight;

  Gems.resize(width, height);
  Chair.resize(width, height);
});

// Handle anims
const gemsCanvas = document.getElementById("section4");
const creatorCanvas = document.getElementById("footerCanvas");

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    Gems.onObserve(entry, observer);
    Typeout.onObserve(entry, observer);
  });
};


window.alert('js is working.')

// const observer = new IntersectionObserver(observerCallback, {
//   root: null, // Use the viewport as the root
//   threshold: 0.1, // Trigger when 10% of the element is visible
// });

// observer.observe(Gems.container);
// observer.observe(Chair.container);


// function handleAnims(entries, observer) {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       if (entry.target === gemCanvas) {
//         console.log("Gem Container is in the viewport.xxx ");
//         gemPause = false;
//         animateGem();
//       } else if (entry.target === creatorCanvas) {
//         console.log("Creators Container is in the viewport.xxx");
//         chairPause = false;
//         animateChair();
//       }
//     } else {
//       if (entry.target === gemCanvas) {
//         gemPause = true;
//         console.log("Gem Container has left the viewport.000");
//       } else if (entry.target === creatorCanvas) {
//         chairPause = true;
//         console.log("Creators Container has left the viewport.000");
//       }
//     }
//   });
// }

// const observerOptions = {
//   root: null, // Use the viewport as the root
//   threshold: 0.1, // Trigger when 10% of the element is visible
// };

// const observer = new IntersectionObserver(handleAnims, observerOptions);
// observer.observe(gemCanvas);
// observer.observe(creatorCanvas);
