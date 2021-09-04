import * as THREE from 'three'
import RotationPad from './rotation-pad'
import MovementPad from './movement-pad'

export default class TouchControls {
  constructor(container, camera, scene) {
    this.container = container
    this.camera = camera
    this.scene = scene
    this.config = {
      speedFactor: 6,
      delta: 1,
      rotationFactor: 0.002,
      maxPitch: 55,
      hitTest: true,
      hitTestDistance: 40
    }
    this.isRightMouseDown = false
    this.rotationMatrices = []
    this.hitObjects = []
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
    this.PI_2 = Math.PI / 2
    this.maxPitch = this.config.maxPitch * Math.PI / 180
    this.velocity = new THREE.Vector3(0, 0, 0)
    this.cameraHolder = new THREE.Object3D()
    this.cameraHolder.name = 'cameraHolder'
    this.cameraHolder.add(this.camera)
    this.fpsBody = new THREE.Object3D()
    this.fpsBody.add(this.cameraHolder)
    this.enabled = true
    this.mouse = new THREE.Vector2(0,0)

    this.createRotationPad()
    this.createMovementPad()
    this.addEventListener()
    this.prepareRotationMatrices()
  }

  createRotationPad () {
    this.rotationPad = new RotationPad(this.container)

    document.getElementById('rotation-pad').addEventListener('YawPitch', event => {
      const rotation = this.calculateCameraRotation(event.detail.deltaX, event.detail.deltaY)
      this.setRotation(rotation.rx, rotation.ry)
    })
  }

  createMovementPad () {
    this.movementPad = new MovementPad(this.container)

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

    this.movementPad.addEventListener('stopMove', event => {
      this.ztouch = this.xtouch = 1
      this.moveForward = this.moveBackward = this.moveLeft = this.moveRight = false
    })
  }

  addEventListener() {
    this.container.addEventListener('contextmenu', () => this.onContextMenu)
    this.container.addEventListener('mousedown', () => this.onMouseDown)
    this.container.addEventListener('mouseup', () => this.onMouseUp)

    document.addEventListener('keydown', () => this.onKeyDown)
    document.addEventListener('keyup', () => this.onKeyUp)
    document.addEventListener('mousemove', () => this.onMouseMove)
    document.addEventListener('mouseout', () => this.onMouseOut)
  }

  onContextMenu (event) {
    event.preventDefault()
  }

  onMouseDown (event) {
    if (this.enabled && event.button === 2) {
      this.isRightMouseDown = true
      event.preventDefault()
      event.stopPropagation()
    }
  }

  onMouseUp (event) {
    if (this.enabled && event.button === 2) {
      this.isRightMouseDown = false
    }
  }

  onMouseMove (event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    if (!this.enabled || !this.isRightMouseDown) return

    let movementX = event.originalEvent.movementX || event.originalEvent.mozMovementX || event.originalEvent.webkitMovementX || 0
    let movementY = event.originalEvent.movementY || event.originalEvent.mozMovementY || event.originalEvent.webkitMovementY || 0
    let rotation = this.calculateCameraRotation(-1 * movementX, -1 * movementY)

    this.setRotation(rotation.rx, rotation.ry)
  }

  onMouseOut (event) {
    this.isRightMouseDown = false
  }

  onKeyDown (event) {
    if (!this.enabled) return

    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        this.moveForward = true
        break

      case 37: // left
      case 65: // a
        this.moveLeft = true
        break

      case 40: // down
      case 83: // s
        this.moveBackward = true
        break

      case 39: // right
      case 68: // d
        this.moveRight = true
        break
    }
  }

  onKeyUp (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        this.moveForward = false
        break

      case 37: // left
      case 65: // a
        this.moveLeft = false
        break

      case 40: // down
      case 83: // a
        this.moveBackward = false
        break

      case 39: // right
      case 68: // d
        this.moveRight = false
        break

    }
  }

  prepareRotationMatrices () {
    let rotationMatrixF = new THREE.Matrix4()
    rotationMatrixF.makeRotationY(0)
    this.rotationMatrices.push(rotationMatrixF); // forward direction.

    let rotationMatrixB = new THREE.Matrix4()
    rotationMatrixB.makeRotationY(180 * Math.PI / 180)
    this.rotationMatrices.push(rotationMatrixB)

    let rotationMatrixL = new THREE.Matrix4()
    rotationMatrixL.makeRotationY(90 * Math.PI / 180)
    this.rotationMatrices.push(rotationMatrixL)

    let rotationMatrixR = new THREE.Matrix4()
    rotationMatrixR.makeRotationY((360 - 90) * Math.PI / 180)
    this.rotationMatrices.push(rotationMatrixR)
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

  lockDirectionByIndex (index) {
    if (index == 0)
      this.lockMoveForward(true)
    else if (index == 1)
      this.lockMoveBackward(true)
    else if (index == 2)
      this.lockMoveLeft(true)
    else if (index == 3)
      this.lockMoveRight(true)
  }

  update () {
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

  getDirection () {
    let rx = 0
    let ry = 0
    let direction = new THREE.Vector3(0, 0, -1)
    let rotation = new THREE.Euler(0, 0, 0, 'YXZ')

    if (this != undefined) {
      rx = this.fpsBody.getObjectByName('cameraHolder').rotation.x
      ry = this.fpsBody.rotation.y
    }

    return function (v) {
      rotation.set(rx, ry, 0)
      v.copy(direction).applyEuler(rotation)
      return v
    }
  }

  unlockAllDirections () {
    this.lockMoveForward = false
    this.lockMoveBackward= false
    this.lockMoveLeft = false
    this.lockMoveRight = false
  }

  addToScene (scene) {
    this.scene.add(this.fpsBody)
  }

  setPosition (x, y, z) {
    this.fpsBody.position.set(x, y, z)
  }

  stopMouseMoving () {
    this.isRightMouseDown = false
  }

  setRotation (x, y) {
    if (x !== null)
      this.camera.rotateX(x)

    if (y !== null)
      this.camera.rotateY(y)
  }
}