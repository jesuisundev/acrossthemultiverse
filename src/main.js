import './style.css'
import * as THREE from 'three'
import * as POSTPROCESSING from 'postprocessing'

import Grid from './world/Grid'
import Controls from './world/Controls'
import Library from './world/Library'
import Parameters from './world/Parameters'
import Effect from './postprocessing/Effect'
import Sequencer from './sequencer/sequencer'

const clock = new THREE.Clock()
const parameters = new Parameters()

setDefaultGlobal()

const scene = new THREE.Scene()
scene.background = new THREE.Color(parameters.global.background[window.currentUniverse])
scene.fog = new THREE.Fog(
  parameters.global.background[window.currentUniverse],
  parameters.global.camera.near,
  parameters.global.camera.far
)

const renderer = new THREE.WebGLRenderer(parameters.global.webGlRenderer)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.domElement.id = 'multiverse'
document.body.appendChild(renderer.domElement)

// ROAD MAP
// TODO : build tweark for others universes
// CHAPTER 2 WONDER UNIVERSE same but crazy colors
// CHAPTER 3 FILAMENT UNIVERSE irregular: {randomnessPower: 0.00002 }
// CHAPTER 4 build epiphany - univers buble in a comet shape
// TODO : Validate BETA
// TODO : lock fps
// TODO : performance
// TODO : add UI -> back to cinema for perfo ?
// TODO : add music control - > scroll volume
// TODO : handle mobile control
// TODO : detect clavier
// TODO : refactor clean up comment
// TODO : push to cloudfare
// DEADLINE -> 13 sept
const camera = new THREE.PerspectiveCamera(
  parameters.global.camera.fov, // can you fix the fov issue without sacrifying the wow effect ?
  window.innerWidth / window.innerHeight,
  parameters.global.camera.near,
  parameters.global.camera.far
)
camera.rotation.z = 0.8

const library = new Library()
const grid = new Grid(camera, parameters, scene, library)
const sequencer = new Sequencer(scene, library, parameters, grid, camera)
const controls = new Controls(camera, parameters, sequencer)
const effect = new Effect(camera, parameters)

const skipIntro = true

let lastClusterPosition
let needRender = false
let isRenderingClusterInProgress = false
let prevTimePerf = performance.now()


// preload every needed files before showing anything
library.preload()
window.onload = () => {
  needRender = true

  sequencer.launchNextSequence(skipIntro)
}

scene.add(controls.pointerLockControls.getObject())

document.addEventListener('keydown', (event) => controls.onKeyDown(event))
document.addEventListener('keyup', (event) => controls.onKeyUp(event))
document.addEventListener('click', (event) => controls.pointerLockControls.lock())
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  composer.setSize(window.innerWidth, window.innerHeight)
  camera.updateProjectionMatrix()
})

const composer = new POSTPROCESSING.EffectComposer(renderer)
composer.addPass(new POSTPROCESSING.RenderPass(scene, camera))
composer.addPass(effect.getEffectPass())

function setDefaultGlobal() {
  window.currentUniverse = 0
  window.materialsToUpdate = {}
  window.meshesToUpdate = {}
  window.wormhole = {
    shape: null,
    CameraPositionIndex: 0,
    speed: parameters.wormhole.speed,
    active: false
  }
}

function animate (time) {
  if (needRender) {
    if (window.wormhole.active) {
      updatePositionInWormhole()
    } else {
      composer.render()
    }
  }

  const elapsedTime = clock.getElapsedTime()
  updateAnimatedObjects(elapsedTime)

  const timePerf = performance.now()
  if (controls.pointerLockControls.isLocked === true) {
    controls.handleMovements(timePerf, prevTimePerf)
  }
  prevTimePerf = time

  if (!window.wormhole.active) {
    camera.position.z -= parameters.global.camera.defaultForward
  }

  requestAnimationFrame(animate)

  const currentClusterPosition = grid.getCurrentClusterPosition()

  if (lastClusterPosition !== currentClusterPosition && !sequencer.active) {
    lastClusterPosition = currentClusterPosition

    const clustersStatus = grid.getClustersStatus(currentClusterPosition)

    grid.disposeClusters(clustersStatus.clustersToDispose)
    grid.buildMatters(clustersStatus.clustersToPopulate)
  } else if (grid.queueClusters.size && !isRenderingClusterInProgress) {
    isRenderingClusterInProgress = true

    const clusterTorender = grid.queueClusters.keys().next().value

    setTimeout(() => {
      grid.renderMatters(clusterTorender, grid.queueClusters.get(clusterTorender))
      isRenderingClusterInProgress = false
    }, parameters.global.clusterRenderTimeOut)
  }
}

function updateAnimatedObjects (elapsedTime) {
  // update materials (shaders animation)
  if (Object.keys(window.materialsToUpdate).length) {
    for (const materialToUpdate of Object.values(window.materialsToUpdate)) {
      materialToUpdate.uniforms.uTime.value = elapsedTime
    }
  }

  // update mesh (object animation)
  if (Object.keys(window.meshesToUpdate).length) {
    for (const meshToUpdate of Object.values(window.meshesToUpdate)) {
      meshToUpdate.rotateZ(2)

      if (camera.position.distanceTo(meshToUpdate.position) < 4000 && !sequencer.active) {
        sequencer.wormholeSequence()
      }
    }
  }
}

function updatePositionInWormhole () {
  window.wormhole.CameraPositionIndex++

  if (window.wormhole.CameraPositionIndex > window.wormhole.speed) {
    window.wormhole.CameraPositionIndex = 0
  }

  const wormholeCameraPosition = window.wormhole.shape.getPoint(window.wormhole.CameraPositionIndex / window.wormhole.speed)
  const wormholeCameraRotation = window.wormhole.shape.getTangent(window.wormhole.CameraPositionIndex / window.wormhole.speed)

  camera.position.x = wormholeCameraPosition.x
  camera.position.y = wormholeCameraPosition.y
  camera.position.z = wormholeCameraPosition.z

  camera.rotation.x = wormholeCameraRotation.x
  camera.rotation.y = wormholeCameraRotation.y
  camera.rotation.z = wormholeCameraRotation.z

  camera.lookAt(window.wormhole.shape.getPoint((window.wormhole.CameraPositionIndex + 1) / window.wormhole.speed))

  composer.render()
}

animate()