import './style.css'
import * as THREE from 'three'
import * as POSTPROCESSING from "postprocessing"
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import * as dat from 'dat.gui'

// scene, rendering and camera basic setup
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: false,
    stencil: false,
    depth: false
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.domElement.id = "multiverse"
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    10,
    10000
)

// setup miscelanous values
const controls = new PointerLockControls(camera, document.body)
const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()
const starTexture = new THREE.TextureLoader().load("star.png")
const starShineTexture = new THREE.TextureLoader().load("star-shine.png")
const parameters = {
    starfield: {
        squareSectorSize: 2000
    }
}

let needRender = true
let effectPass
let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let prevTimePerf = performance.now()

/**
 * TODO
 * @param {*} max 
 * @returns 
 */
function getStarsGeometry(max = 5000) {
    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(getVerticesInRandomPosition(max), 3)
    )

    return geometry
}

/**
 * TODO
 * @param {*} max 
 * @returns 
 */
function getVerticesInRandomPosition(max) {
    const vertices = []

    for (let i = 0; i < max; i++) {
        // random positions confined in a square sector
        const x = parameters.starfield.squareSectorSize * Math.random() - (parameters.starfield.squareSectorSize / 2)
        const y = parameters.starfield.squareSectorSize * Math.random() - (parameters.starfield.squareSectorSize / 2)
        const z = parameters.starfield.squareSectorSize * Math.random() - (parameters.starfield.squareSectorSize / 2)

        vertices.push(x, y, z)
    }

    return vertices
}

/**
 * TODO
 * @param {*} texture 
 * @param {*} opacity 
 * @param {*} size 
 * @returns 
 */
function getStarsMaterial(texture, opacity = 1, size = 5) {
    return new THREE.PointsMaterial({
        size: size,
        sizeAttenuation: true,
        map: texture,
        depthWrite: false,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: opacity
    })
}

const brightStars = new THREE.Points(
    getStarsGeometry(20000),
    getStarsMaterial(starShineTexture, 1)
)
const mediumStars = new THREE.Points(
    getStarsGeometry(20000),
    getStarsMaterial(starTexture, 0.6)
)
const paleStars = new THREE.Points(
    getStarsGeometry(10000),
    getStarsMaterial(starTexture, 0.2)
)



scene.add(brightStars, mediumStars, paleStars)
scene.add(controls.getObject())

const onKeyDown = (event) => {
    switch (event.code) {
        case "ArrowUp":
        case "KeyW":
            moveForward = true
            break
        case "ArrowLeft":
        case "KeyA":
            moveLeft = true
            break
        case "ArrowDown":
        case "KeyS":
            moveBackward = true
            break
        case "ArrowRight":
        case "KeyD":
            moveRight = true
            break
    }
}

const onKeyUp = (event) => {
    switch (event.code) {
        case "ArrowUp":
        case "KeyW":
            moveForward = false
            break
        case "ArrowLeft":
        case "KeyA":
            moveLeft = false
            break
        case "ArrowDown":
        case "KeyS":
            moveBackward = false
            break
        case "ArrowRight":
        case "KeyD":
            moveRight = false
            break
    }
}

document.addEventListener("keydown", onKeyDown)
document.addEventListener("keyup", onKeyUp)
document.addEventListener("click", () => controls.lock())

const bloomEffect = new POSTPROCESSING.BloomEffect({
    blendFunction: POSTPROCESSING.BlendFunction.SCREEN,
    kernelSize: POSTPROCESSING.KernelSize.SMALL
})
bloomEffect.blendMode.opacity.value = 2

// using a global variable because effects will be highly animated during the experience
effectPass = new POSTPROCESSING.EffectPass(camera, bloomEffect)
effectPass.renderToScreen = true

const composer = new POSTPROCESSING.EffectComposer(renderer)
composer.addPass(new POSTPROCESSING.RenderPass(scene, camera))
composer.addPass(effectPass)

function animate(time) {
    if (needRender) {
        composer.render()
    }

    const timePerf = performance.now()
    if (controls.isLocked === true) {
        const delta = (timePerf - prevTimePerf) / 1000

        direction.z = Number(moveForward) - Number(moveBackward)
        direction.x = Number(moveRight) - Number(moveLeft)

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta

        controls.moveRight(-velocity.x * delta)
        controls.moveForward(-velocity.z * delta)
    }
    prevTimePerf = time

    camera.position.z -= 0.05

    let current = Math.random()

    if (current > 0.6 && current < 0.65) mediumStars.material.opacity = current

    rotateUniverse()

    requestAnimationFrame(animate)
        //console.log(getCameraCurrentPosition(camera))
}

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    composer.setSize(window.innerWidth, window.innerHeight)
    camera.updateProjectionMatrix()
})

function rotateUniverse(force = 0.0003) {
    brightStars.rotation.z += force
    mediumStars.rotation.z += force
    paleStars.rotation.z += force
}

function getCameraCurrentPosition(camera) {
    camera.updateMatrixWorld()
    return camera.position
}

animate()