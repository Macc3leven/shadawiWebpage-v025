const gletters = document.querySelectorAll(".glet");
const stexts = document.querySelectorAll(".stext");

const viewportHeight = window.innerHeight;
function handleScroll() {
  gletters.forEach((glet) => {
    const rect = glet.getBoundingClientRect();
    const relativePosition = rect.top / viewportHeight;
    var rotation = 75 - (1 - relativePosition) * 100;
    rotation = Math.max(0, rotation);
    glet.style.transform = `translateX(${Math.max(
      0,
      rotation - 10
    )}%) rotate(${rotation}deg)`;
  });

  stexts.forEach((slideTxt) => {
    const rect = slideTxt.getBoundingClientRect();
    const alignType = slideTxt.style.textAlign;
    
    // slide characters in from the left
    const relativePosition = rect.top / viewportHeight;
    var rotation = 50 - (1 - relativePosition) * 100;
    rotation = Math.max(0, rotation);
    slideTxt.style.transform = `translateX(${rotation}%)`;
  });
}

window.addEventListener("scroll", handleScroll);
handleScroll();