import './style.css'
//import Stats from 'stats.js'
import * as THREE from 'three'

import Grid from './world/Grid'
import Controls from './controls/Controls'
import Library from './world/Library'
import Parameters from './world/Parameters'
import PostProcessor from './postprocessing/PostProcessor'
import Sequencer from './sequencer/sequencer'

//const stats = new Stats()
//stats.showPanel(0)
//document.body.appendChild(stats.dom)
const clock = new THREE.Clock()
const parameters = new Parameters()

setDefaultGlobal()

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(parameters.global.background[window.currentUniverse], parameters.global.camera.near, parameters.global.camera.far)

const renderWidth = Math.floor(window.innerWidth / 1.2)
const renderHeight = Math.floor(window.innerHeight / 1.2)
const renderer = new THREE.WebGLRenderer(parameters.global.webGlRenderer)
renderer.setClearColor(new THREE.Color(parameters.global.background[window.currentUniverse]))
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(renderWidth, renderHeight)
renderer.shadowMap.autoUpdate = false
renderer.shadowMap.needsUpdate = true
renderer.domElement.id = 'multiverse'
document.body.appendChild(renderer.domElement)

// ROAD MAP
// TODO : handle mobile control
// TODO : detect clavier
// TODO : TECHNICAL TEST - FIX perf and bugs
// BC
// - I would like the speed to significatively drop when I don't press any button.
// - It was lagging on my big screen 27
// - I did not find the blue black hole so I had to press f
// - F11 BUTTON It would be so nice to have a real fullscreen mode like when you watch a video on YouTube you don't have the adress bar nor the tabs
// Simon
// Suggestion: Entre les niveau, reset le mouvement du joueur (je garde le même momentum)
// Suggestion: Appuyer sur Space arrête le mouvement.
// Suggestion: Bouton pour prendre un screenshot.
// Physics should impact gameplay
// Simon2
// Weird collider that’s too close to the camera that obscures objects before they leave the field of view
// Esc should say: Release Mouse Cursor
// TODO : refactor clean up comment
// DEADLINE -> 13 sept
const camera = new THREE.PerspectiveCamera(
  parameters.global.camera.fov, // can you fix the fov issue without sacrifying the wow effect ?
  renderWidth / renderHeight,
  parameters.global.camera.near,
  parameters.global.camera.far
)
camera.rotation.z = 0.8

const library = new Library()
const grid = new Grid(camera, parameters, scene, library)
const postProcessor = new PostProcessor(camera, scene, parameters, renderer)
const sequencer = new Sequencer(scene, library, parameters, grid, camera, postProcessor)
const controls = new Controls(camera, parameters, sequencer, library)
window.controls = controls

const skipIntro = false

let lastClusterPosition
let needRender = false
let isRenderingClusterInProgress = false
let previousElapsedTime = clock.getElapsedTime()


/**
 * Handle preload of assets and show launch call to action
 */
async function init() {
    library.preload()

    window.onload = () => {
        document.getElementById('loading').remove()
        document.getElementById('launch').className = 'fadeIn'
    }

    await controls.showElementById("title")
    await controls.showElementById("description")
    await controls.showElementById("notice")
    await controls.showElementById("entrypoint")
}

scene.add(controls.pointerLockControls.getObject())

document.addEventListener('keydown', (event) => controls.onKeyDown(event))
document.addEventListener('keyup', (event) => controls.onKeyUp(event))
document.getElementById('multiverse').addEventListener('click', (event) => controls.pointerLockControls.lock())
document.getElementById('launch').addEventListener('click', (event) => {
  event.preventDefault()
  needRender = true
  controls.pointerLockControls.lock()
  document.getElementById('intro').className = 'fadeOut'
  sequencer.launchNextSequence()
})

window.addEventListener('resize', () => {
  renderer.setSize(renderWidth, renderHeight)
  camera.aspect = renderWidth / renderHeight
  postProcessor.composer.setSize(renderWidth, renderHeight)
  camera.updateProjectionMatrix()
})

// i'm lazy, we could refactor some code and avoid globals
function setDefaultGlobal() {
  window.currentUniverse = 0
  window.materialsToUpdate = {}
  window.meshesToUpdate = {}
  window.wormhole = { shape: null, CameraPositionIndex: 0, speed: parameters.wormhole.speed, active: false }
  window.sequencer = { active: false }
}

function animate () {
  //stats.begin()
  const currentElapsedTime = clock.getElapsedTime()

  if (needRender) {
    if (window.wormhole.active) {
      updatePositionInWormhole()
    } else {
      postProcessor.composer.render()
    }
  }

  updateAnimatedObjects(currentElapsedTime)

  if (controls.pointerLockControls.isLocked === true) {
    controls.handleMovements(currentElapsedTime, previousElapsedTime)
  }
  previousElapsedTime = currentElapsedTime

  if (!window.wormhole.active) {
    camera.position.z -= parameters.global.camera.defaultForward
  }

  requestAnimationFrame(animate)

  const currentClusterPosition = grid.getCurrentClusterPosition()

  if (lastClusterPosition !== currentClusterPosition && !window.sequencer.active) {
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

      if (camera.position.distanceTo(meshToUpdate.position) < 4000 && !window.sequencer.active) {
        sequencer.wormholeSequence()
      }
    }
  }
  //stats.end()
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

  postProcessor.composer.render()
}

animate()
init()