import './style.css'
import * as THREE from 'three'
import * as POSTPROCESSING from "postprocessing"

import MultiverseFactory from './procedural/MultiverseFactory'
import Grid from './world/Grid'
import Controls from './world/Controls'
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

const controls = new Controls(camera, parameters)
const library = new Library()
const grid = new Grid(camera, parameters)
const multiverseFactory = new MultiverseFactory(scene, library, parameters)
const effect = new Effect(camera, parameters)

let lastSectorPosition
let needRender = false
let isRenderingSectorInProgress = false
let prevTimePerf = performance.now()

// preload every needed files before showing anything
library.preload()
window.onload = () => needRender = true

scene.add(controls.pointerLockControls.getObject())

document.addEventListener("keydown", (event) => controls.onKeyDown(event))
document.addEventListener("keyup", (event) => controls.onKeyUp(event))
document.addEventListener("click", (event) => controls.pointerLockControls.lock())
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

function buildMatters(sectorsToPopulate) {
    workers[THREE.MathUtils.randInt(0, workers.length - 1)].postMessage({ sectorsToPopulate, parameters })
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
    if (controls.pointerLockControls.isLocked === true) {
        controls.handleMovements(timePerf, prevTimePerf)
    } else {
        camera.rotation.z += parameters.global.camera.defaultRotation
    }
    prevTimePerf = time

    camera.position.z -= parameters.global.camera.defaultForward

    requestAnimationFrame(animate)

    const currentSectorPosition = grid.getCurrentSectorPosition()

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