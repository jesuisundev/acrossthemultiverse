import './style.css'
import * as THREE from 'three'
import * as POSTPROCESSING from "postprocessing"
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import * as dat from 'dat.gui'

import Grid from './world/grid'
import Starfield from './procedural/starfield'

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
    1000
)

// setup miscelanous values
const controls = new PointerLockControls(camera, document.body)
const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()

let needRender = true
let effectPass
let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let prevTimePerf = performance.now()
let lastSectorPosition

const grid = new Grid()

scene.add(controls.getObject())

//scene.background = new THREE.Color(0x030909)

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
bloomEffect.blendMode.opacity.value = 4

// using a global variable because effects will be highly animated during the experience
effectPass = new POSTPROCESSING.EffectPass(camera, bloomEffect)
effectPass.renderToScreen = true

const composer = new POSTPROCESSING.EffectComposer(renderer)
composer.addPass(new POSTPROCESSING.RenderPass(scene, camera))
composer.addPass(effectPass)

const gridHelper = new THREE.GridHelper(22000, 11, 0x00FF00, 0x00FF00);
gridHelper.position.y = -300
scene.add(gridHelper);

if (!window.Worker) {
    throw new Error("You browser is shit. Do something about it.");
}

const starfieldWorker = new Worker(
    new URL(
        './procedural/starfield-worker.js',
        import.meta.url
    )
)

// @todo the messaging internal system is slow here (GB issue) not sure what to do :(
// optimise objects, split and all ?
// make it call right away, only way to render
starfieldWorker.onmessage = messageEvent => addStarfieldsDataToSectorsQueue(messageEvent.data)

// @todo - should be on grid side
function addStarfieldsDataToSectorsQueue(starfieldsVertices) {
    for (let sectorToPopulate of Object.keys(starfieldsVertices)) {
        const starfieldQueueValue = {
            type: 'starfield',
            data: starfieldsVertices[sectorToPopulate]
        }

        grid.queueSectors.set(sectorToPopulate, starfieldQueueValue)
    }
}

// @todo - should be on grid side
function renderSectorFromQueue(sectorPosition, sectorData) {
    switch (sectorData.type) {
        case 'starfield':
            const starfield = new Starfield(scene)
            const randomStarfield = starfield.getRandomStarfield(sectorData.data)

            starfield.setStarfield(randomStarfield)
            grid.activeSectors.set(sectorPosition, starfield)

            starfield.show()
            break;
        default:
            console.log('Render sector type unknown', sectorData.type)
    }
}

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

    requestAnimationFrame(animate)

    let currentSectorPosition = grid.getCurrentSectorPosition(getCameraCurrentPosition(camera))

    if (lastSectorPosition != currentSectorPosition) {
        const sectorsStatus = grid.getSectorsStatus(currentSectorPosition)
        grid.disposeSectors(sectorsStatus.sectorsToDispose)
            // @todo : function which decide what and how generated stuff in grid
            // @todo : use the right worker by types
            // hardcoding starfields only
        starfieldWorker.postMessage({
            sectorsToPopulate: sectorsStatus.sectorsToPopulate,
            sectorSize: grid.parameters.sectorSize
        })

        lastSectorPosition = currentSectorPosition
    } else if (grid.queueSectors.size) {
        // @todo - should be on grid side
        const sectorTorender = grid.queueSectors.keys().next().value

        renderSectorFromQueue(sectorTorender, grid.queueSectors.get(sectorTorender))

        grid.queueSectors.delete(sectorTorender)
    }

    // todo determnine if this will be a problem for the grid
    //grid.activeSectors.forEach(rotateUniverse)
}

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    composer.setSize(window.innerWidth, window.innerHeight)
    camera.updateProjectionMatrix()
})

function rotateUniverse(value, key, map) {
    const force = 0.0003

    // @todo: detect object and change access to rotation accordinly
    value.starfield.bright.points.rotation.z += force
    value.starfield.normal.points.rotation.z += force
    value.starfield.pale.points.rotation.z += force
}

function getCameraCurrentPosition(camera) {
    camera.updateMatrixWorld()
    return camera.position
}

animate()