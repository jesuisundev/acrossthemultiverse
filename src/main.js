import './style.css'
import * as THREE from 'three'
import * as POSTPROCESSING from "postprocessing"

import MultiverseFactory from './procedural/MultiverseFactory'
import Workers from './procedural/Workers'
import Grid from './world/Grid'
import Controls from './world/Controls'
import Library from './world/Library'
import Parameters from './world/Parameters'
import Effect from './postprocessing/Effect'

import vertexShader from './shaders/singularity/blackhole/vertex.glsl'
import fragmentShader from './shaders/singularity/blackhole/fragment.glsl'

const clock = new THREE.Clock()
const parameters = new Parameters()

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer(parameters.global.webGlRenderer)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.domElement.id = "multiverse"
document.body.appendChild(renderer.domElement)

// ROAD MAP
// TODO : build simple blackhole (sphere with shader distortion tweaking fresnel) - wip
// TODO : more randomess in emission
// TODO : build wrap hole travel
// LEARN SHADER
// TODO : build four types of galaxy https://theplanets.org/types-of-galaxies/
// TODO : improve blackhole ?
// todo : maybe a way to set material https://github.com/brunosimon/experiment-rick-and-morty-tribute/blob/master/src/Experience/Particles.js
// TODO : ask for UI/UX
// TODO : build tweark for others universes
// TODO : build epiphany - filament interconnected of universes via shaders points
// TODO : add sequencer
// TODO : lock fps
// TODO : performance
// TODO : add UI and music
// TODO : push to cloudfare
const camera = new THREE.PerspectiveCamera(
    parameters.global.camera.fov, // can you fix the fov issue without sacrifying the wow effect ?
    window.innerWidth / window.innerHeight,
    parameters.global.camera.near,
    parameters.global.camera.far
)

const controls = new Controls(camera, parameters)
const library = new Library()
const grid = new Grid(camera, parameters)
const workers = new Workers(grid)
const multiverseFactory = new MultiverseFactory(scene, library, parameters)
const effect = new Effect(camera, parameters)

let lastClusterPosition
let needRender = false
let isRenderingClusterInProgress = false
let prevTimePerf = performance.now()
let material
let mesh

// preload every needed files before showing anything
library.preload()
window.onload = () => {
    // Geometry
    const geometry = new THREE.RingGeometry( 1, 10, 32 )
    //const geometry = new THREE.CircleGeometry( 5, 32 );
    //const geometry = new THREE.TorusGeometry( 10, 0.8, 30, 100 );
    // Material
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader, 
        fragmentShader: fragmentShader,
        uniforms: {
            uFrequency: { value : new THREE.Vector2(250, 250) },
            uTime: { value: 0 },
            uTexture: { value: library.textures.blackhole.disk[0] }
        },
        side: THREE.DoubleSide
    })

    material.needsUpdate = true
    mesh = new THREE.Mesh(geometry, material)
    mesh.scale.set(1000,1000,1000)
    scene.add(mesh)

    mesh.position.z = -10000
    needRender = true
}

window.materialsToUpdate = {}

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

function buildMatters(clustersToPopulate) {
    for(let clusterToPopulate of clustersToPopulate) {
        const randomDistributedWorker = workers.getWorkerDistributed(clusterToPopulate)

        randomDistributedWorker.postMessage({
            clustersToPopulate: [clusterToPopulate],
            parameters: parameters
        })
    }
}

function renderMatters(position, cluster) {
    const matter = multiverseFactory.createMatter(cluster.type)

    matter.generate(cluster.data, position, cluster.subtype)
    matter.show()

    grid.queueClusters.delete(position)
    grid.activeClusters.set(position, matter)
}

function animate(time) {
    if (needRender) {
        composer.render()
    }

    const elapsedTime = clock.getElapsedTime()

    if(material) {
        material.uniforms.uTime.value = elapsedTime
        material.needsUpdate = true
    }
    if(mesh) {
        mesh.rotateZ(1)
    }

    if(Object.keys(window.materialsToUpdate).length) {
        for(let materialToUpdate of Object.values(window.materialsToUpdate)) {
            materialToUpdate.uniforms.uTime.value = elapsedTime
        }
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