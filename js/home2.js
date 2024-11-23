import './_nav2.js';
import Gems from './scenes/gems.js'
import Chair from './scenes/chair.js'

Gems.init();
Chair.init();

//handle canvas resizing
// window.addEventListener("resize", function () {
//     var width = window.innerWidth;
//     var height = window.innerHeight;
//     creatorsRenderer.setSize(width, height);
//     creatorsCamera.aspect = width / height;
//     updateSize();
//     creatorsCamera.updateProjectionMatrix();
//   });

// Handle anims
// const gemElem = document.getElementById("section4");
// const creatorsElem = document.getElementById("footerContainer");
// function handleAnims(entries, observer) {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       if (entry.target === gemElem) {
//         console.log("Gem Container is in the viewport.xxx ");
//         gemPause = false;
//         animateGem();
//       } else if (entry.target === creatorsElem) {
//         console.log("Creators Container is in the viewport.xxx");
//         chairPause = false;
//         animateChair();
//       }
//     } else {
//       if (entry.target === gemElem) {
//         gemPause = true;
//         console.log("Gem Container has left the viewport.000");
//       } else if (entry.target === creatorsElem) {
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
// observer.observe(gemElem);
// observer.observe(creatorsElem);