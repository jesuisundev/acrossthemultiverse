import './style.css'
import * as THREE from 'three'
import * as POSTPROCESSING from "postprocessing"
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

import MultiverseFactory from './procedural/MultiverseFactory'
import Grid from './world/Grid'
import Library from './world/Library'
import Parameters from './world/Parameters'
import Effect from './postprocessing/Effect'

const parameters = new Parameters()

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer(parameters.global.webGlRenderer)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.domElement.id = "multiverse"
document.body.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(
    parameters.global.camera.fov,
    window.innerWidth / window.innerHeight,
    parameters.global.camera.near,
    parameters.global.camera.far
)

// TODO : put everything control in a class
const controls = new PointerLockControls(camera, document.body)
const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()
const library = new Library()
const grid = new Grid(parameters)
const multiverseFactory = new MultiverseFactory(scene, library, parameters)
const effect = new Effect(camera, parameters)

let lastSectorPosition
let needRender = false
let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let isRenderingSectorInProgress = false
let prevTimePerf = performance.now()

// preload every needed files to optimise performance
library.preload()
// will render something only if everyting has been loaded
window.onload = () => needRender = true

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
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    composer.setSize(window.innerWidth, window.innerHeight)
    camera.updateProjectionMatrix()
})

const composer = new POSTPROCESSING.EffectComposer(renderer)
composer.addPass(new POSTPROCESSING.RenderPass(scene, camera))
composer.addPass(effect.getEffectPass())

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

// TODO : use three mathutils
function getRandomNumberBeetwen(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }

function buildMatters(sectorsToPopulate) {
    const workerMessage = {
        sectorsToPopulate: sectorsToPopulate,
        sectorSize: grid.parameters.sectorSize,
        parameters: parameters.matters.starfield
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

        if (moveForward || moveBackward) {
            // TODO : handle velocity limitation
            velocity.z -= direction.z * parameters.controls.velocity * delta
        }

        if (moveLeft || moveRight) {
            velocity.x -= direction.x * parameters.controls.velocity * delta
        }

        controls.moveRight(-velocity.x * delta)
        controls.moveForward(-velocity.z * delta)
    } else {
        camera.rotation.z += parameters.global.camera.defaultRotation
    }
    prevTimePerf = time

    camera.position.z -= parameters.global.camera.defaultForward

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
        }, parameters.global.sectorRenderTimeOut)
    }
}

animate()