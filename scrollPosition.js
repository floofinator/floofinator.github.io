window.addEventListener("scroll", function(){
    var scroll = window.scrollY;
    var limit = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - window.innerHeight;
    var scrollpos = document.getElementById("scroll_position");
    scrollpos.textContent=scroll;
    scrollpos.style.top=(scroll/limit)*(window.innerHeight-scrollpos.clientHeight*2)+"px";
});