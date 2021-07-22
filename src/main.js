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

// TODO : Try to make spline starfield works
// TODO : build stellar association starfield

// TODO : build nebula starfield
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

let lastClusterPosition
let needRender = false
let isRenderingClusterInProgress = false
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

const openStarfieldWorker = new Worker(new URL('./procedural/starfield/OpenStarfieldWorker.js', import.meta.url))
const globularStarfieldWorker = new Worker(new URL('./procedural/starfield/GlobularStarfieldWorker.js', import.meta.url))
openStarfieldWorker.onmessage = messageEvent => addStarfieldsToClustersQueue(messageEvent.data)
globularStarfieldWorker.onmessage = messageEvent => addStarfieldsToClustersQueue(messageEvent.data)

function addStarfieldsToClustersQueue(starfields) {
    for (let clusterToPopulate of Object.keys(starfields)) {
        grid.queueClusters.set(clusterToPopulate, {
            type: 'starfield',
            data: starfields[clusterToPopulate]
        })
    }
}

workers.push(openStarfieldWorker, globularStarfieldWorker)

function buildMatters(clustersToPopulate) {
    for(let clusterToPopulate of clustersToPopulate) {
        const randomWorkerIndex = clusterToPopulate === '0,0,0' ? 0 : THREE.MathUtils.randInt(0, workers.length - 1)

        workers[randomWorkerIndex].postMessage({
            clustersToPopulate: [clusterToPopulate],
            parameters: parameters
        })
    }
}

function renderMatters(position, cluster) {
    const matter = multiverseFactory.createMatter(cluster.type)

    matter.generate(cluster.data, position)
    matter.show()

    grid.queueClusters.delete(position)
    grid.activeClusters.set(position, matter)
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

    const currentClusterPosition = grid.getCurrentClusterPosition()

    if (lastClusterPosition != currentClusterPosition) {
        lastClusterPosition = currentClusterPosition

        // disposing of useless clusters to free memory
        const clustersStatus = grid.getClustersStatus(currentClusterPosition)
        grid.disposeClusters(clustersStatus.clustersToDispose)

        buildMatters(clustersStatus.clustersToPopulate)
    } else if (grid.queueClusters.size && !isRenderingClusterInProgress) {
        isRenderingClusterInProgress = true

        const clusterTorender = grid.queueClusters.keys().next().value

        setTimeout(() => {
            renderMatters(clusterTorender, grid.queueClusters.get(clusterTorender))
            isRenderingClusterInProgress = false
        }, parameters.global.clusterRenderTimeOut)
    }
}

animate()