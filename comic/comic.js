
var maxPage = 4;
var current = 1;
var page = document.getElementById("page");
var path = page.src;
var next = document.getElementById("next");
var previous = document.getElementById("previous");

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

changePage(0);

var flipDirection = 0;

function changePage(direction){
    var last = current;
    current = clamp(current+direction,1,maxPage);
    flipDirection = direction;
    page.src = path + current + ".png";
    if(last!=current){
        page.classList.remove("pageAppearLeft");
        page.classList.remove("pageAppearRight");
        page.classList.add("pageFade");
        void page.offsetWidth;
    }
    previous.disabled = current==1;
    next.disabled = current==maxPage;
}

page.addEventListener('load', function() {
    page.classList.remove("pageFade");
    if(flipDirection>0){
        page.classList.add("pageAppearRight");
    }else{
        page.classList.add("pageAppearLeft");
    }
}, false);

var fullscreen = document.getElementById("fullScreen");

function openFullscreen() {
    if (fullscreen.requestFullscreen) {
        fullscreen.requestFullscreen();
    } else if (fullscreen.webkitRequestFullscreen) { /* Safari */
        fullscreen.webkitRequestFullscreen();
    } else if (fullscreen.msRequestFullscreen) { /* IE11 */
        fullscreen.msRequestFullscreen();
    }
}