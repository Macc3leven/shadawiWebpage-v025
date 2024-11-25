const typeTxts = document.querySelectorAll(".typeTxt");

const scn = {
  handlers: [],
  onObserve: null
}

// Initialize handlers for each .typeTxt element
for (let i = 0; i < typeTxts.length; i++) {
  const txt = typeTxts[i];
  scn.handlers.push({
    element: txt,
    index: i,
    speed: 3000 / txt.innerText.split(" ").length,
    words: txt.innerText.split(" "), // Split text into words
    initialized: false,
    currentWordIndex: 0, // Tracks the current word being typed
    currentDisplayText: "", // Tracks the text displayed so far
  });

  // Clear the inner text to begin typing effect
  txt.innerText = "";
}

// Typing function for a specific element
function typeWords(handler) {
  if (handler.currentWordIndex < handler.words.length) {
    handler.currentDisplayText += handler.words[handler.currentWordIndex] + " ";
    handler.element.innerText = handler.currentDisplayText;
    handler.currentWordIndex++;

    // Continue typing for this element
    setTimeout(() => typeWords(handler), handler.speed); // Adjust the speed (300ms per word)
  }
}

// Observer callback to trigger typing effect
scn.onObserve = (entry, observer) => {
  const match = scn.handlers.some((elem) => elem.index === entry.index);
  console.log({match})
  if (!match) return;

  if (entry.isIntersecting) {
    const handler = scn.handlers.find((h) => h.element === entry.target);

    if (handler && !handler.initialized) {
      handler.initialized = true; // Mark as initialized
      typeWords(handler); // Start typing effect
    }

    observer.unobserve(entry.target); // Stop observing once initialized
  }
};

export default scn;

// // Create the observer
// const observer = new IntersectionObserver(onObserve, {
//   root: null, // Use the viewport as the root
//   threshold: 0.1, // Trigger when 10% of the element is visible
// });

// // Observe each .typeTxt element
// typeTxts.forEach((txt) => observer.observe(txt));
