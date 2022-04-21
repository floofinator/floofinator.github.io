window.addEventListener("scroll", function(){
    var scroll = window.scrollY;
    var limit = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - window.innerHeight;
    var scrollpos = document.getElementById("scroll_position");

    var value = (scroll/limit);
    scrollpos.innerText="⇧";

    var positionRange = (window.innerHeight-scrollpos.clientHeight*2);
    scrollpos.style.top=value*positionRange+"px";
});

function topOfPage(){
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}