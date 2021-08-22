import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import * as THREE from 'three'

export default class Controls {
  constructor (camera, parameters, sequencer) {
    this.parameters = parameters
    this.camera = camera
    this.sequencer = sequencer

    this.pointerLockControls = new PointerLockControls(this.camera, document.body)
    this.velocity = new THREE.Vector3()
    this.direction = new THREE.Vector3()

    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false
  }

  onKeyDown (event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.moveForward = true
        break
      case 'ArrowLeft':
      case 'KeyA':
        this.moveLeft = true
        break
      case 'ArrowDown':
      case 'KeyS':
        this.moveBackward = true
        break
      case 'ArrowRight':
      case 'KeyD':
        this.moveRight = true
        break
      case 'KeyF':
        this.sequencer.wormholeSequence()
        break
    }
  }

  onKeyUp (event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.moveForward = false
        break
      case 'ArrowLeft':
      case 'KeyA':
        this.moveLeft = false
        break
      case 'ArrowDown':
      case 'KeyS':
        this.moveBackward = false
        break
      case 'ArrowRight':
      case 'KeyD':
        this.moveRight = false
        break
    }
  }

  handleMovements (timePerf, prevTimePerf) {
    const delta = (timePerf - prevTimePerf) / 1000

    this.direction.z = Number(this.moveForward) - Number(this.moveBackward)
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft)

    if (this.moveForward || this.moveBackward) {
      if ((this.moveForward && this.parameters.controls.speedLimit.down < this.velocity.z) || (this.moveBackward && this.parameters.controls.speedLimit.up > this.velocity.z)) {
        this.velocity.z -= this.direction.z * this.parameters.controls.velocity * delta
      }
    }

    if (this.moveLeft || this.moveRight) {
      if ((this.moveLeft && this.parameters.controls.speedLimit.up > this.velocity.x) || (this.moveRight && this.parameters.controls.speedLimit.down < this.velocity.x)) {
        this.velocity.x -= this.direction.x * this.parameters.controls.velocity * delta
      }
    }

    this.pointerLockControls.moveRight(-this.velocity.x * delta)
    this.pointerLockControls.moveForward(-this.velocity.z * delta)
  }
}
