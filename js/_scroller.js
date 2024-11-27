const gletters = document.querySelectorAll(".glet");
const stexts = document.querySelectorAll(".stext");
const typeOutElements = document.querySelectorAll(".typeOut");
const viewportHeight = window.innerHeight;

// Preprocess the text for .typeOut elements
const typeOutHandlers = Array.from(typeOutElements).map((el) => ({
  element: el,
  words: el.innerText.split(" "), // Split text into an array of words
  text: el.innerText, // Store the full text
  height: el.getBoundingClientRect().height
}));
setInterval(()=>{
  console.log(typeOutHandlers[0].element.style.height);
  typeOutHandlers[0].element.style.height = typeOutHandlers[0].height
},2000);

function handleScroll() {
  // Handle `.glet` elements
  gletters.forEach((glet) => {
    const rect = glet.getBoundingClientRect();
    const relativePosition = rect.top / viewportHeight;
    let rotation = 75 - (1 - relativePosition) * 100;
    rotation = Math.max(0, rotation);
    glet.style.transform = `translateX(${Math.max(
      0,
      rotation - 10
    )}%) rotate(${rotation}deg)`;
  });

  // Handle `.stext` elements
  stexts.forEach((slideTxt) => {
    const rect = slideTxt.getBoundingClientRect();
    const relativePosition = rect.top / viewportHeight;
    let x_postion = 50 - (1 - relativePosition) * 100;
    x_postion = Math.max(0, x_postion);

    if (slideTxt.style.textAlign == "right") {
      slideTxt.style.transform = `translateX(${x_postion}%)`;
    } else {
      slideTxt.style.transform = `translateX(${x_postion * -1}%)`;
    }
  });

  // Handle `.typeOut` elements
  typeOutHandlers.forEach(({ element, words }) => {
    const rect = element.getBoundingClientRect();

    // Ensure calculations are accurate and reversed logic fixed
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(viewportHeight, rect.bottom);
    const visibleHeight = (visibleBottom - visibleTop) + 1;
    

    // Compute the percentage of the element that is visible
    const visibilityPercent = Math.max(0, Math.min(1, visibleHeight / rect.height)) * 100;
    // console.log({visibleBottom,visibleTop,visibleHeight,visibilityPercent});

    // Determine how much text to display based on visibility percentage
    const totalWords = words.length;
    const visibleWords = Math.floor((visibilityPercent / 100) * totalWords);

    // Display the calculated portion of the text
    element.innerText = words.slice(0, visibleWords).join(" ");
  });
}

// Attach the handler to the scroll event
window.addEventListener("scroll", handleScroll);
