function include(file) {
  
    var script  = document.createElement('script');
    script.src  = file;
    script.type = 'text/javascript';
    script.defer = true;
    
    document.getElementsByTagName('head').item(0).appendChild(script);
    
}

include('https://git.io/perlin.js')

class DriftingPoint{
    constructor(x,y,driftx,drifty){
        this.x = x;
        this.y = y;
        this.driftx = driftx;
        this.drifty = drifty;
    }
    drift() {
        this.x += this.driftx;
        this.y += this.drifty;
    }
    accelerate(){
        var divisor = drag+1;
        this.driftx /= divisor;
        this.drifty /= divisor;
    }
}
var canvas = document.getElementById("overlay");
var context = canvas.getContext("2d");
var mousePosition = new DriftingPoint(0,0);
var wind = new DriftingPoint(0,0,0.0125,0.0125);
const length = 2048;
var scale = 0.125;
var drift = 2;
var drag = 0.0125;
var pointList = [];
window.onresize = updateOverlaySize;
window.onmousemove = function(e){mousePosition = new DriftingPoint(e.clientX,e.clientY);};
window.onmousedown = function(e){updateOverlaySize()};
function addPoint(){
    const perlinX = (mousePosition.x/canvas.clientWidth)*scale + wind.x;
    const perlinY = (mousePosition.y/canvas.clientHeight)*scale + wind.y;
    const driftx = perlin.get(perlinX,perlinY)*drift;
    const drifty = perlin.get(perlinX+0.25,perlinY+0.25)*drift;
    newPoint = new DriftingPoint(mousePosition.x,mousePosition.y,driftx,drifty);
    pointList.push(newPoint);
    if(pointList.length > length)
    pointList.shift();
}
function driftLine(pointList){
    for (let index = 0; index < pointList.length; index++) {
        const point = pointList[index];
        point.drift();
        point.accelerate();
    }
}
function drawLine(pointList){
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = 2;
    context.beginPath();
    context.strokeStyle = "#FFFFFF"
    for (let index = 1; index < pointList.length; index++) {
        const point = pointList[index];
        const previous = pointList[index-1];
        context.moveTo(previous.x,previous.y);
        context.lineTo(point.x,point.y);
    }
    context.stroke();
}
function updateOverlaySize(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
function clearOverlay(){context.clearRect(0, 0, canvas.width, canvas.height);}
function updateOverlay(){
    clearOverlay();
    wind.drift();
    addPoint(mousePosition);
    driftLine(pointList);
    drawLine(pointList);
}
updateOverlaySize();
var interval = setInterval(updateOverlay,20);