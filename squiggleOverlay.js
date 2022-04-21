function include(file) {
  
    var script  = document.createElement('script');
    script.src  = file;
    script.type = 'text/javascript';
    script.defer = true;
    
    document.getElementsByTagName('head').item(0).appendChild(script);
    
}

include('https://git.io/perlin.js')

class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class DriftingPoint extends Point{
    constructor(x,y,velocityX,velocityY){
        super(x,y);
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }
    drift() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
    accelerate(multiplier){
        this.velocityX *= multiplier;
        this.velocityY *= multiplier;
    }
}
class DriftingLine{
    constructor(color,width,length,velocity,multiplier,windX,windY,windChange){
        this.wind = new DriftingPoint(windX,windY,windChange,windChange);
        this.pointList = [];
        this.color = color;
        this.length = length;
        this.width = width;
        this.velocity = velocity;
        this.multiplier = multiplier;
    }
    addPoint(point){
        const perlinX = (point.x/canvas.clientWidth)*scale + this.wind.x;
        const perlinY = (point.y/canvas.clientHeight)*scale + this.wind.y;
        const velocityX = perlin.get(perlinX,perlinY)*this.velocity;
        const velocityY = perlin.get(perlinX+0.5,perlinY+0.5)*this.velocity;
        var newPoint = new DriftingPoint(point.x,point.y,velocityX,velocityY);
        this.pointList.push(newPoint);
        if(this.pointList.length > this.length)
            this.pointList.shift();
    }
    drift(){
        this.wind.drift();
        for (let index = 0; index < this.pointList.length; index++) {
            const point = this.pointList[index];
            point.drift();
            point.accelerate(this.multiplier);
        }
    }
    draw(){
        context.lineJoin = "round";
        context.lineCap = "round";
        context.lineWidth = this.width;
        context.beginPath();
        context.strokeStyle = this.color;

        for (let index = 1; index < this.pointList.length; index++) {
            const point = this.pointList[index];
            const previous = this.pointList[index-1];
            context.moveTo(previous.x,previous.y);
            context.lineTo(point.x,point.y);
        }
        context.stroke();

    }
}
var canvas = document.getElementById("squiggleCanvas");
var context = canvas.getContext("2d");

var mousePoint = new DriftingPoint(0,0);

var scale = 0.125;

window.onresize = updateOverlaySize;
window.onmousemove = function(e){mousePoint = new DriftingPoint(e.clientX,e.clientY);};
window.onmousedown = function(e){updateOverlaySize()};

var lines = [];

function updateOverlaySize(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
function clearOverlay(){context.clearRect(0, 0, canvas.width, canvas.height);}

function updateOverlay(){
    clearOverlay();
    lines.forEach(line => {
        line.addPoint(mousePoint);
        line.drift();
        line.draw();
    });
}
updateOverlaySize();
var interval = setInterval(updateOverlay,20);