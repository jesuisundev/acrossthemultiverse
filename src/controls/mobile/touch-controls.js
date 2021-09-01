'use strict'

import * as THREE from 'three'

function TouchControls (container, camera, options) {
  let self = this
  self.config = $.extend({
    speedFactor: 0.5,
    delta: 1,
    rotationFactor: 0.002,
    maxPitch: 55,
    hitTest: true,
    hitTestDistance: 40
  }, options)

  let container = container
  let isRightMouseDown = false
  let rotationMatrices = []
  let hitObjects = []

  let moveForward = false
  let moveBackward = false
  let moveLeft = false
  let moveRight = false
  let lockMoveForward = false
  let lockMoveBackward = false
  let lockMoveLeft = false
  let lockMoveRight = false

  let ztouch = 1, xtouch = 1
  let PI_2 = Math.PI / 2
  let maxPitch = self.config.maxPitch * Math.PI / 180
  let velocity = new THREE.Vector3(0, 0, 0)

  let cameraHolder = new THREE.Object3D()
  cameraHolder.name = 'cameraHolder'
  cameraHolder.add(camera)

  self.scene = null
  self.fpsBody = new THREE.Object3D()
  self.fpsBody.add(cameraHolder)
  self.enabled = true

  self.mouse = new THREE.Vector2()

  // Creating rotation pad:
  self.rotationPad = new RotationPad(container)
  $(self.rotationPad).on('YawPitch', function (event) {
    let rotation = calculateCameraRotation(event.detail.deltaX, event.detail.deltaY)
    self.setRotation(rotation.rx, rotation.ry)
  })

  // Creating movement pad:
  self.movementPad = new MovementPad(container)
  $(self.movementPad).on('move', function (event) {
    ztouch = Math.abs(event.detail.deltaY)
    xtouch = Math.abs(event.detail.deltaX)

    if (event.detail.deltaY == event.detail.middle) {
      ztouch = 1
      moveForward = moveBackward = false
    } else {
      if (event.detail.deltaY > event.detail.middle) {
        moveForward = true
        moveBackward = false
      }
      else if (event.detail.deltaY < event.detail.middle) {
        moveForward = false
        moveBackward = true
      }
    }

    if (event.detail.deltaX == event.detail.middle) {
      xtouch = 1
      moveRight = moveLeft = false
    } else {
      if (event.detail.deltaX < event.detail.middle) {
        moveRight = true
        moveLeft = false
      }
      else if (event.detail.deltaX > event.detail.middle) {
        moveRight = false
        moveLeft = true
      }
    }
  })
  $(self.movementPad).on('stopMove', function (event) {
    ztouch = xtouch = 1
    moveForward = moveBackward = moveLeft = moveRight = false
  })

  container.on('contextmenu', onContextMenu)
  container.on('mousedown', onMouseDown)
  container.on('mouseup', onMouseUp)

  $(document).on('keydown', onKeyDown)
  $(document).on('keyup', onKeyUp)
  $(document).on('mousemove', onMouseMove)
  $(document).on('mouseout', onMouseOut)

  prepareRotationMatrices()

  //
  // Events:
  //
  function onContextMenu (event) {
    event.preventDefault()
  }

  function onMouseDown (event) {
    if (self.enabled && event.button === 2) {
      isRightMouseDown = true
      event.preventDefault()
      event.stopPropagation()
    }
  }

  function onMouseUp (event) {
    if (self.enabled && event.button === 2) {
      isRightMouseDown = false
    }
  }

  function onMouseMove (event) {
    self.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    self.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    if (!self.enabled || !isRightMouseDown) return

    let movementX = event.originalEvent.movementX || event.originalEvent.mozMovementX || event.originalEvent.webkitMovementX || 0
    let movementY = event.originalEvent.movementY || event.originalEvent.mozMovementY || event.originalEvent.webkitMovementY || 0
    let rotation = calculateCameraRotation(-1 * movementX, -1 * movementY)

    self.setRotation(rotation.rx, rotation.ry)
  }

  function onMouseOut (e) {
    isRightMouseDown = false
  }

  function onKeyDown (e) {
    if (!self.enabled) return

    switch (e.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true
        break

      case 37: // left
      case 65: // a
        moveLeft = true
        break

      case 40: // down
      case 83: // s
        moveBackward = true
        break

      case 39: // right
      case 68: // d
        moveRight = true
        break
    }
  }

  function onKeyUp (e) {
    switch (e.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false
        break

      case 37: // left
      case 65: // a
        moveLeft = false
        break

      case 40: // down
      case 83: // a
        moveBackward = false
        break

      case 39: // right
      case 68: // d
        moveRight = false
        break

    }
  }

  //
  // Private functions:
  //
  function prepareRotationMatrices () {
    let rotationMatrixF = new THREE.Matrix4()
    rotationMatrixF.makeRotationY(0)
    rotationMatrices.push(rotationMatrixF); // forward direction.

    let rotationMatrixB = new THREE.Matrix4()
    rotationMatrixB.makeRotationY(180 * Math.PI / 180)
    rotationMatrices.push(rotationMatrixB)

    let rotationMatrixL = new THREE.Matrix4()
    rotationMatrixL.makeRotationY(90 * Math.PI / 180)
    rotationMatrices.push(rotationMatrixL)

    let rotationMatrixR = new THREE.Matrix4()
    rotationMatrixR.makeRotationY((360 - 90) * Math.PI / 180)
    rotationMatrices.push(rotationMatrixR)
  }

  function calculateCameraRotation (dx, dy, factor) {
    let factor = factor ? factor : self.config.rotationFactor
    let ry = self.fpsBody.rotation.y - (dx * factor)
    let rx = cameraHolder.rotation.x - (dy * factor)
    rx = Math.max(-maxPitch, Math.min(maxPitch, rx))

    return {
      rx: rx,
      ry: ry
    }
  }

  function lockDirectionByIndex (index) {
    if (index == 0)
      self.lockMoveForward(true)
    else if (index == 1)
      self.lockMoveBackward(true)
    else if (index == 2)
      self.lockMoveLeft(true)
    else if (index == 3)
      self.lockMoveRight(true)
  }

  //
  // Public functions:
  //
  self.update = function () {
    if (self.config.hitTest)
      self.hitTest()

    velocity.x += (-1 * velocity.x) * 0.75 * self.config.delta
    velocity.z += (-1 * velocity.z) * 0.75 * self.config.delta

    if (moveForward && !lockMoveForward) velocity.z -= ztouch * self.config.speedFactor * self.config.delta
    if (moveBackward && !lockMoveBackward) velocity.z += ztouch * self.config.speedFactor * self.config.delta

    if (moveLeft && !lockMoveLeft) velocity.x -= xtouch * self.config.speedFactor * self.config.delta
    if (moveRight && !lockMoveRight) velocity.x += xtouch * self.config.speedFactor * self.config.delta

    self.fpsBody.translateX(velocity.x)
    self.fpsBody.translateY(velocity.y)
    self.fpsBody.translateZ(velocity.z)
  }

  self.hitTest = function () {
    self.unlockAllDirections()
    hitObjects = []
    let cameraDirection = self.getDirection2(new THREE.Vector3(0, 0, 0)).clone()

    for (let i = 0; i < 4; i++) {
      // Applying rotation for each direction:
      let direction = cameraDirection.clone()
      direction.applyMatrix4(rotationMatrices[i])

      let rayCaster = new THREE.Raycaster(self.fpsBody.position, direction)
      let intersects = rayCaster.intersectObject(self.scene, true)
      if ( (intersects.length > 0 && intersects[0].distance < self.config.hitTestDistance)) {
        lockDirectionByIndex(i)
        hitObjects.push(intersects[0])
      }
    }

    return hitObjects
  }

  self.getDirection2 = function (v) {
    let self = this
    let direction = new THREE.Vector3(0, 0, -1)
    let rotation = new THREE.Euler(0, 0, 0, 'YXZ')
    let rx = self.fpsBody.getObjectByName('cameraHolder').rotation.x
    let ry = self.fpsBody.rotation.y

    rotation.set(rx, ry, 0)
    v.copy(direction).applyEuler(rotation)

    return v
  }

  self.getDirection = function () {
    let self = this
    let rx = 0
    let ry = 0
    let direction = new THREE.Vector3(0, 0, -1)
    let rotation = new THREE.Euler(0, 0, 0, 'YXZ')

    if (self != undefined) {
      rx = self.fpsBody.getObjectByName('cameraHolder').rotation.x
      ry = self.fpsBody.rotation.y
      console.log(rx, ry)
    }

    return function (v) {
      rotation.set(rx, ry, 0)
      v.copy(direction).applyEuler(rotation)
      return v
    }
  }()

  self.moveLeft = function () {
    return moveLeft
  }

  self.moveRight = function () {
    return moveRight
  }

  self.moveForward = function () {
    return moveForward
  }

  self.moveBackward = function () {
    return moveBackward
  }

  self.lockMoveForward = function (boolean) {
    lockMoveForward = boolean
  }

  self.lockMoveBackward = function (boolean) {
    lockMoveBackward = boolean
  }

  self.lockMoveLeft = function (boolean) {
    lockMoveLeft = boolean
  }

  self.lockMoveRight = function (boolean) {
    lockMoveRight = boolean
  }

  self.unlockAllDirections = function () {
    self.lockMoveForward(false)
    self.lockMoveBackward(false)
    self.lockMoveLeft(false)
    self.lockMoveRight(false)
  }
}

TouchControls.prototype = {
  addToScene: function (scene) {
    this.scene = scene
    scene.add(this.fpsBody)
  },

  setPosition: function (x, y, z) {
    this.fpsBody.position.set(x, y, z)
  },

  stopMouseMoving: function () {
    isRightMouseDown = false
  },

  setRotation: function (x, y) {
    let camHolder = this.fpsBody.getObjectByName('cameraHolder')

    if (x !== null)
      camHolder.rotation.x = x

    if (y !== null)
      this.fpsBody.rotation.y = y
  },

  getHitObjects: function () {
    return hitObjects
  }

}
