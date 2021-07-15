import './style.css'
import * as THREE from 'three'
import * as POSTPROCESSING from "postprocessing"
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import * as dat from 'dat.gui'

import Grid from './world/Grid'
import MultiverseFactory from './procedural/MultiverseFactory'

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
let isRenderingSectorInProgress = false

const grid = new Grid()
const multiverseFactory = new MultiverseFactory(scene)

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

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    composer.setSize(window.innerWidth, window.innerHeight)
    camera.updateProjectionMatrix()
})


/**
 * Web worker used for heavy work on background. Critical to not block the event loop.
 */
if (!window.Worker) {
    throw new Error("You browser is shit. Do something about it.");
}

const workers = []

const starfieldWorker = new Worker(new URL('./procedural/starfield/StarfieldWorker.js', import.meta.url))
starfieldWorker.onmessage = messageEvent => addStarfieldsToSectorsQueue(messageEvent.data)

function addStarfieldsToSectorsQueue(starfields) {
    for (let sectorToPopulate of Object.keys(starfields)) {
        grid.queueSectors.set(sectorToPopulate, {
            type: 'starfield',
            data: starfields[sectorToPopulate]
        })
    }
}

workers.push(starfieldWorker)

function getCameraCurrentPosition(camera) {
    camera.updateMatrixWorld()
    return camera.position
}

function getRandomNumberBeetwen(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }

function buildMatters(sectorsToPopulate) {
    const workerMessage = {
        sectorsToPopulate: sectorsToPopulate,
        sectorSize: grid.parameters.sectorSize
    }

    workers[getRandomNumberBeetwen(0, workers.length - 1)].postMessage(workerMessage)
}

function renderMatters(position, sector) {
    const matter = multiverseFactory.createMatter(sector.type)

    matter.generate(sector.data)
    matter.show()

    grid.queueSectors.delete(position)
    grid.activeSectors.set(position, matter)
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
    } else {
        camera.rotation.z += 0.00015
    }
    prevTimePerf = time

    camera.position.z -= 0.05

    requestAnimationFrame(animate)

    let currentSectorPosition = grid.getCurrentSectorPosition(getCameraCurrentPosition(camera))

    if (lastSectorPosition != currentSectorPosition) {
        lastSectorPosition = currentSectorPosition

        // disposing of useless sectors to free memory
        const sectorsStatus = grid.getSectorsStatus(currentSectorPosition)
        grid.disposeSectors(sectorsStatus.sectorsToDispose)

        buildMatters(sectorsStatus.sectorsToPopulate)
    } else if (grid.queueSectors.size && !isRenderingSectorInProgress) {
        isRenderingSectorInProgress = true

        const sectorTorender = grid.queueSectors.keys().next().value

        setTimeout(() => {
            renderMatters(sectorTorender, grid.queueSectors.get(sectorTorender))
            isRenderingSectorInProgress = false
        }, 200)
    }
}

animate()