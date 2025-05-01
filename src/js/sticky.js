
var nav = document.getElementById("sticky");

//store where the starting offset is
var navTop = nav.offsetTop;

function CheckSticky() {
  if (window.scrollY > navTop) {
    nav.classList.add("sticking");
  } else {
    nav.classList.remove("sticking");
  }
}

window.addEventListener("scroll", CheckSticky)