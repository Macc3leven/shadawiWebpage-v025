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
    let x_postion = 50 - (1 - relativePosition) * 100;
    x_postion = Math.max(0, x_postion);
    if (slideTxt.style.textAlign == "right") {
      slideTxt.style.transform = `translateX(${x_postion}%)`;
    } else {
      // left
      slideTxt.style.transform = `translateX(${x_postion * -1}%)`;
    }

    // console.log({ st: slideTxt.style.textAlign, x_postion });
  });
}

window.addEventListener("scroll", handleScroll);
handleScroll();
