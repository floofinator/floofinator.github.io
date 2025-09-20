// Values

const particleTime = 10
const particleSize = 0.05
const particleWait = 0.5
const particleBaseVelocity = 1.5
const particleRandomVelocity = 0.25
const gravity = 4
const collisionScale = 1.6
const timeScale = 0.5

const collisionDamp = 0.5
const collisionRotRandom = 0.5
const collisionRotDamp = -0.5

const bounceDamp = 0.75
const bounceRotRandom = 2
const bounceRotDamp = 0.75

//Code!

import * as THREE from 'three'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

var canvas = document.getElementById("background")

var camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas, alpha: true });

function SetupBackground()
{
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // console.log(camera.aspect);
}

addEventListener("resize", SetupBackground);
SetupBackground()

camera.position.y = 5
camera.position.x = 0
camera.position.z = 0
camera.rotateX(-Math.PI * 0.5)

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// const ambient = new THREE.HemisphereLight(0xfffced, 0x426896, 1);
// scene.add(ambient);

const sunlight = new THREE.DirectionalLight(0xfffced, 1);
sunlight.castShadow = true;

sunlight.position.set(0, 2, 0);

sunlight.target.position.set(0, 0, 0);

sunlight.shadow.camera.near = 0.001;
sunlight.shadow.camera.far = 5;

sunlight.shadow.camera.left = -2;
sunlight.shadow.camera.right = 2;
sunlight.shadow.camera.top = 2;
sunlight.shadow.camera.bottom = -8;

sunlight.shadowCameraVisible = true;

sunlight.shadow.mapSize.set(512,1024)

scene.add(sunlight);

const geometryP = new THREE.PlaneGeometry(10, 10);
const materialP = new THREE.ShadowMaterial()
materialP.opacity = 1
const plane = new THREE.Mesh(geometryP, materialP);

plane.position.y = -0.05
plane.castShadow = false;
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const texture = new THREE.TextureLoader().load('/models/texture.png');
texture.colorSpace = THREE.SRGBColorSpace;
texture.flipY = false;

const glftLoader = new GLTFLoader();

const material = new THREE.MeshBasicMaterial({
    map: texture
});

var particles = []

function createParticle(modelName, x, y, z, v) {
    var particle = new THREE.Object3D();

    particle.castShadow = true
    
    loadModel(modelName, particle)

    particle.position.x = x
    particle.position.y = y
    particle.position.z = z

    particle.rotation.x = Math.PI * Math.random()
    particle.rotation.y = Math.PI * Math.random()
    particle.rotation.y = Math.PI * Math.random()

    particle.velocity = randVector();
    particle.velocity.y = 0
    particle.velocity.setLength(v + Math.random() * particleRandomVelocity)

    particle.angularVelocity = randVector().multiplyScalar(Math.PI * 2)

    particle.timer = particleTime;
    particle.fade = 1
    particles.push(particle)

    scene.add(particle);
}

function randVector() {
    return new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
}

var models = {}

function loadModel(modelName, parent) {
    if (models[modelName]) {
        parent.add(models[modelName].clone())
    }
    else
    {
        console.log("loading new model " + modelName)

        glftLoader.load("/models/" + modelName + ".glb", (glb) => {
            var model = glb.scene

            model.castShadow = true;

            model.traverse((o) => {
                if (o.isMesh) {
                    o.material = material;
                    o.castShadow = true;
                }
            });

            models[modelName] = model
    
            parent.add(model)
        });
    }
}

var emitTime = 0;

function destroyParticle(particle) {
    const index = particles.indexOf(particle);
    particles.splice(index, 1);
    scene.remove(particle);
}

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var screenPosition = new THREE.Vector3();

onclick = (event) => {

    screenPosition.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        - (event.clientY / window.innerHeight) * 2 + 1,
        0.5,
    );
    
    screenPosition.unproject( camera );

    var vector = screenPosition.clone().sub(camera.position).normalize()

    console.log("Click! " + screenPosition.x + " " + screenPosition.y + " " + screenPosition.z)

    var point = camera.position.clone().add(vector.setLength(4))

    createParticle("Candy" + getRandomInt(0, 11), point.x, point.y, point.z, 0)
};

function easeOutElastic(x) {
    const c4 = (2.0 * Math.PI) / 3.0;

    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2.0, -10.0 * x) * Math.sin((x * 10.0 - 0.75) * c4) + 1.0;
}

function easeInBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return c3 * x * x * x - c1 * x * x;
}

function update() {
    emitTime += deltaTime;

    if (emitTime > particleWait) {
        

        var x = camera.position.x
        var y = 0.1
        var z = camera.position.z
        createParticle("Candy" + getRandomInt(0, 11), x, y, z, particleBaseVelocity)
        emitTime = 0
    }

    camera.position.z = window.scrollY / 1000

    particles.forEach((particle) => {

        particle.timer -= deltaTime;
        if (particle.timer < 0) {
            particle.fade -= deltaTime / 0.5
        }

        var pop_in = (particleTime - particle.timer) / 0.5

        particle.scale.setScalar(particleSize * (pop_in > 1 ? (particle.fade < 1 ? 1.0 - easeInBack(1.0 - particle.fade) : 1) : easeOutElastic(pop_in)))

        if (particle.fade < 0) {
            destroyParticle(particle);
            return;
        }

        particles.forEach((other) => {
            if (other == particle) return;

            var difference = other.position.clone().sub(particle.position) // from particle to other
            var distance = difference.length()
            var direction = difference.normalize()

            var collisionSize = particleSize * collisionScale

            if (distance < collisionSize) {
                var overlap = collisionSize - distance

                other.position.sub(direction.clone().setScalar(overlap * -0.5))
                particle.position.sub(direction.clone().setScalar(overlap * 0.5))

                var velocitySum = other.velocity.clone().projectOnVector(direction).add(particle.velocity.clone().projectOnVector(direction))

                particle.angularVelocity.multiplyScalar(collisionRotDamp)
                particle.angularVelocity.add(randVector().multiplyScalar(Math.PI * particle.velocity.length() * collisionRotRandom))

                other.angularVelocity.multiplyScalar(collisionRotDamp)
                other.angularVelocity.add(randVector().multiplyScalar(Math.PI * particle.velocity.length() * collisionRotRandom))

                other.velocity.sub(velocitySum.clone().multiplyScalar(0.5 * collisionDamp))
                particle.velocity.sub(velocitySum.clone().multiplyScalar(-0.5 * collisionDamp))
            }
        })

        particle.velocity.y -= gravity * deltaTime;

        particle.position.x += particle.velocity.x * deltaTime
        particle.position.y += particle.velocity.y * deltaTime
        particle.position.z += particle.velocity.z * deltaTime

        if (particle.position.y < 0) {
            particle.velocity.multiplyScalar(bounceDamp)
            particle.velocity.y *= -1

            particle.angularVelocity.multiplyScalar(bounceRotDamp)
            particle.angularVelocity.add(randVector().multiplyScalar(Math.PI * particle.velocity.length() * bounceRotRandom))

            particle.position.y = 0
        }

        particle.rotateX(particle.angularVelocity.x * deltaTime)
        particle.rotateY(particle.angularVelocity.y * deltaTime)
        particle.rotateZ(particle.angularVelocity.z * deltaTime)
    });
}

var lastTime = Date.now();
var deltaTime = 0

var maxDelta = 0.1

function animate() {
    var currentTime = Date.now();
    deltaTime = ((currentTime - lastTime) / 1000) * timeScale;
    if (deltaTime > maxDelta) deltaTime = maxDelta

    update();

    renderer.render(scene, camera);

    lastTime = currentTime;

    requestAnimationFrame(animate);
}
animate();
