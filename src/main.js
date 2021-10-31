import './style.css'
import * as THREE from 'three'

import Grid from './world/Grid'
import Controls from './controls/Controls'
import TouchControls from './controls/mobile/touch-controls'
import Library from './world/Library'
import Parameters from './world/Parameters'
import PostProcessor from './postprocessing/PostProcessor'
import Sequencer from './sequencer/sequencer'
import Helper from './world/Helper'
import Multiplayer from './multiplayer/Multiplayer'
import PropertySign from './blockchain/PropertySign'

const clock = new THREE.Clock()
const parameters = new Parameters()
const helper = new Helper(parameters)

helper.setDefaultGlobal()

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(parameters.global.background[window.currentUniverse], parameters.global.camera.near, parameters.global.camera.far)

const ambientLight = new THREE.AmbientLight("#FFFFFF", 1)
scene.add(ambientLight)

let resizedRenderResolution = helper.getResizedRenderResolution()
const renderWidth = resizedRenderResolution.renderWidth
const renderHeight = resizedRenderResolution.renderHeight
const renderer = new THREE.WebGLRenderer(parameters.global.webGlRenderer)
renderer.setClearColor(new THREE.Color(parameters.global.background[window.currentUniverse]))
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(renderWidth, renderHeight)
renderer.shadowMap.autoUpdate = false
renderer.shadowMap.needsUpdate = true
renderer.domElement.id = 'multiverse'
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(
  parameters.global.camera.fov, // can you fix the fov issue without sacrifying the wow effect ?
  renderWidth / renderHeight,
  parameters.global.camera.near,
  parameters.global.camera.far
)
camera.rotation.z = 1

let controls
let lastClusterPosition
let needRender = false
let isRenderingClusterInProgress = false
let isMultiplayerModeEnable = true
let previousElapsedTime = clock.getElapsedTime()

const library = new Library()
const grid = new Grid(camera, parameters, scene, library)
const postProcessor = new PostProcessor(camera, scene, parameters, renderer)
const propertySign = new PropertySign(camera, scene)
const multiplayer = new Multiplayer(camera, scene, library, propertySign, isMultiplayerModeEnable)
const sequencer = new Sequencer(scene, library, parameters, grid, camera, postProcessor, multiplayer, propertySign)


if (window.isMobileOrTabletFlag) {
  controls = new TouchControls(camera)
} else {
  controls = new Controls(camera, parameters, sequencer, library)
  scene.add(controls.pointerLockControls.getObject())

  document.addEventListener('keydown', event => controls.onKeyDown(event))
  document.addEventListener('keyup', event => controls.onKeyUp(event))
  document.getElementById('multiverse').addEventListener('click', event => controls.pointerLockControls.lock())
}
window.controls = controls

document.getElementById('storyMode').addEventListener('click', event => helper.onModeChosen(event))
document.getElementById('discoveryMode').addEventListener('click', event => helper.onModeChosen(event, true))
document.getElementById('launch').addEventListener('click', event => onLaunch(event))
document.getElementById('launchUltra').addEventListener('click', event => onLaunch(event, true))
window.addEventListener('resize', () => onResize())

function onLaunch(event, isHighEnd = false) {
  event.preventDefault()

  if (!window.isMobileOrTabletFlag)
    controls.pointerLockControls.lock()

  if (isHighEnd) {
    window.highend = isHighEnd
    onResize()
  }

  if(window.isDiscoveryMode) {
    setupMultiplayer()
  }

  document.getElementById('intro').className = 'fadeOut'

  needRender = true
  sequencer.launchNextSequence()
}

function onResize() {
  if (window.highend) {
    resizedRenderResolution.renderWidth = window.innerWidth
    resizedRenderResolution.renderHeight = window.innerHeight
  } else {
    resizedRenderResolution = helper.getResizedRenderResolution()
  }

  renderer.setSize(resizedRenderResolution.renderWidth, resizedRenderResolution.renderHeight)
  camera.aspect = resizedRenderResolution.renderWidth / resizedRenderResolution.renderHeight
  postProcessor.composer.setSize(resizedRenderResolution.renderWidth, resizedRenderResolution.renderHeight)
  camera.updateProjectionMatrix()

  if (window.isMobileOrTabletFlag) {
    controls = new TouchControls(camera)
    window.controls = controls
  }
}

function animate () {
  const currentElapsedTime = clock.getElapsedTime()

  if (needRender) {
    if (window.wormhole.active) {
      updatePositionInWormhole()
    } else {
      postProcessor.composer.render()
      multiplayer.update()
    }
  }

  updateAnimatedObjects(currentElapsedTime)

  if (!window.isMobileOrTabletFlag && controls.pointerLockControls.isLocked === true) {
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

/**
 * Handle preload of assets and show launch call to action
 */
 async function init() {
  library.preload()

  window.onload = () => {
      document.getElementById('loading').remove()
      document.getElementById('launch').className = 'fadeIn'
      document.getElementById('launchUltra').className = 'fadeIn'
      library.postload()
  }

  await helper.showElementById("title")
  await helper.showElementById("description")
  await helper.showElementById("notice")
  await helper.showElementById("entrypoint")
}

 async function setupMultiplayer() {
  if (isMultiplayerModeEnable) {
    try {
      await multiplayer.connect()
    } catch (error) {
      console.error(error)
    }
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

      if (camera.position.distanceTo(meshToUpdate.position) < 8000 && !window.sequencer.active) {
        sequencer.wormholeSequence()
      }
    }
  }

  if (Object.keys(window.spaceshipToUpdate).length) {
    for (const spaceshipToUpdate of Object.values(window.spaceshipToUpdate)) {
      spaceshipToUpdate.rotateX(0.0005)
      spaceshipToUpdate.rotateZ(0.0005)
      spaceshipToUpdate.translateZ(0.005)
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

  postProcessor.composer.render()
}

animate()
init()