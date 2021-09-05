/*
just force myself to handle mobile devices.
this is a rewrite of http://mese79.github.io/TouchControls/
can you fix the bug with double touch ? i dont wanna deal with this shit
i hate mobile devices with a fierce passion of a millions suns
 */

import * as THREE from 'three'
import RotationPad from './rotation-pad'
import MovementPad from './movement-pad'

export default class TouchControls {
  constructor(camera) {
    this.camera = camera
    this.config = {
      speedFactor: 12,
      delta: 1,
      rotationFactor: 0.002,
      maxPitch: 25
    }

    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false
    this.lockMoveForward = false
    this.lockMoveBackward = false
    this.lockMoveLeft = false
    this.lockMoveRight = false
    this.ztouch = 1
    this.xtouch = 1

    this.maxPitch = this.config.maxPitch * Math.PI / 180
    this.velocity = new THREE.Vector3(0, 0, 0)
    this.cameraHolder = new THREE.Object3D()
    this.cameraHolder.name = 'cameraHolder'
    this.cameraHolder.add(this.camera.clone())
    this.fpsBody = new THREE.Object3D()
    this.fpsBody.add(this.cameraHolder)


    this.rotationPad = new RotationPad()
    this.movementPad = new MovementPad()

    this.createRotationPad()
    this.createMovementPad()
  }

  createRotationPad () {
    document.getElementById('rotation-pad').addEventListener('YawPitch', event => {
      const rotation = this.calculateCameraRotation(event.detail.deltaX, event.detail.deltaY)
      this.setRotation(rotation.rx, rotation.ry)
    })
  }

  createMovementPad () {
    document.getElementById('movement-pad').addEventListener('move', event => {
      this.ztouch = Math.abs(event.detail.deltaY)
      this.xtouch = Math.abs(event.detail.deltaX)
  
      if (event.detail.deltaY == event.detail.middle) {
        this.ztouch = 1
        this.moveForward = this.moveBackward = false
      } else {
        if (event.detail.deltaY > event.detail.middle) {
          this.moveForward = true
          this.moveBackward = false
        }
        else if (event.detail.deltaY < event.detail.middle) {
          this.moveForward = false
          this.moveBackward = true
        }
      }
  
      if (event.detail.deltaX == event.detail.middle) {
        this.xtouch = 1
        this.moveRight = this.moveLeft = false
      } else {
        if (event.detail.deltaX < event.detail.middle) {
          this.moveRight = true
          this.moveLeft = false
        }
        else if (event.detail.deltaX > event.detail.middle) {
          this.moveRight = false
          this.moveLeft = true
        }
      }

      this.update()
    })

    document.getElementById('movement-pad').addEventListener('stopMove', event => {
      this.ztouch = this.xtouch = 1
      this.moveForward = this.moveBackward = this.moveLeft = this.moveRight = false
    })
  }

  calculateCameraRotation (dx, dy, factor) {
    let factorFinal = factor ? factor : this.config.rotationFactor
    let ry = this.fpsBody.rotation.y - (dx * factorFinal)
    let rx = this.cameraHolder.rotation.x - (dy * factorFinal)
    rx = Math.max(-this.maxPitch, Math.min(this.maxPitch, rx))

    return {
      rx: rx,
      ry: ry
    }
  }

  update () {
    if(window.sequencer.active) return

    this.velocity.x += (-1 * this.velocity.x) * 0.75 * this.config.delta
    this.velocity.z += (-1 * this.velocity.z) * 0.75 * this.config.delta

    if (this.moveForward && !this.lockMoveForward) this.velocity.z -= this.ztouch * this.config.speedFactor * this.config.delta
    if (this.moveBackward && !this.lockMoveBackward) this.velocity.z += this.ztouch * this.config.speedFactor * this.config.delta
    if (this.moveLeft && !this.lockMoveLeft) this.velocity.x -= this.xtouch * this.config.speedFactor * this.config.delta
    if (this.moveRight && !this.lockMoveRight) this.velocity.x += this.xtouch * this.config.speedFactor * this.config.delta

    this.camera.translateX(this.velocity.x)
    this.camera.translateY(this.velocity.y)
    this.camera.translateZ(this.velocity.z)
  }

  setRotation (x, y) {
    if(window.sequencer.active) return

    if (x !== null)
      this.camera.rotateX(x)

    if (y !== null)
      this.camera.rotateY(y)
  }
}