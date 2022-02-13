var state = {
    x: 64,
    y: 64,
    xVel: 0,
    yVel: 0,
    pressedKeys: {
        left: false,
        right: false,
        up: false,
        down: false
    }
}

var keyMap = {
    68: 'right',
    65: 'left',
    87: 'up',
    83: 'down'
}
function keydown(event) {
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = true
}
function keyup(event) {
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = false
}

window.addEventListener("keydown", keydown, false)
window.addEventListener("keyup", keyup, false)

const item = document.getElementById("moving")
const speed = 0.25

function update(deltaTime) {
    // Update the state of the world for the elapsed time since last render
    if (state.pressedKeys.left) {
        state.xVel -= deltaTime*speed
    }
    if (state.pressedKeys.right) {
        state.xVel += deltaTime*speed
    }
    if (state.pressedKeys.up) {
        state.yVel -= deltaTime*speed
    }
    if (state.pressedKeys.down) {
        state.yVel += deltaTime*speed
    }
    
    state.x += state.xVel;
    state.y += state.yVel;

    state.xVel *= 0.75;
    state.yVel *= 0.75;
    
    bounds = document.body;
    width = bounds.getBoundingClientRect().width
    height = bounds.getBoundingClientRect().height
    
    if(state.x<0){
        state.xVel = 0
        state.x = 0
    }
    if(state.x+64>width){
        state.xVel = 0
        state.x = width-64
    }
    if(state.y<0){
        state.y = 0
    }
    if(state.y+64>height){
        state.yVel = 0
        state.y = height-64
    }
}

function draw() {
    item.style.left = state.x+"px"
    item.style.top = state.y+"px"
}

function loop(timestamp) {
    var deltaTime = timestamp - lastRender

    update(deltaTime)
    draw()

    lastRender = timestamp
    window.requestAnimationFrame(loop)
}
var lastRender = 0
loop()