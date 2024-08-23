// When the user scrolls the page, execute myFunction
window.onscroll = function () { myFunction() };

// Get the header
var nav = document.getElementById("sticky");

// Get the offset position of the navbar
var sticky = nav.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.scrollY > sticky) {
    nav.classList.add("sticking");
  } else {
    nav.classList.remove("sticking");
  }
}

//show
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('show', entry.isIntersecting);
  })
})

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el))