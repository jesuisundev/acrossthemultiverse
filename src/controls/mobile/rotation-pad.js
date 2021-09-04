'use strict'


export default class RotationPad {
  constructor(container) {
    this.container = container
    this.mouseDown = false
    this.eventRepeatTimeout
    this.newLeft
    this.newTop
    this.distance
    this.angle
    this.regionData = {}
    this.handleData = {}
    this.rotationPad = document.getElementById('rotation-pad')
    this.region = document.getElementById('rotation-pad-region')
    this.handle = document.getElementById('rotation-pad-handle')

    this.aligningPad()
    this.addEventListener()
  }

  aligningPad() {
    this.rotationPad.style.top = this.container.style.height + this.container.style.top - this.region.style.height - 10
    this.rotationPad.style.left = this.container.style.width - this.region.style.width - 20
    this.regionData.width = this.region.style.width
    this.regionData.height = this.region.style.height
    this.regionData.position = this.region.style.position
    this.regionData.offset = this.region.style.offset
    this.regionData.radius = this.regionData.width / 2
    this.regionData.centerX = this.regionData.position.left + this.regionData.radius
    this.regionData.centerY = this.regionData.position.top + this.regionData.radius
    this.handleData.width = this.handle.style.width
    this.handleData.height = this.handle.style.height
    this.handleData.radius = this.handleData.width / 2
    this.regionData.radius = this.regionData.width / 2 - this.handleData.radius
  }

  addEventListener() {
    this.region.addEventListener('mousedown', event => {
      this.mouseDown = true
      this.handle.style.opacity = 1
      this.update(event.pageX, event.pageY)
    })

    document.addEventListener('mouseup', () => {
      this.mouseDown = false
    })

    document.addEventListener('mousemove', event => {
      if (!this.mouseDown) return

      this.update(event.pageX, event.pageY)
    })

    this.region.addEventListener('touchstart', event => {
      this.mouseDown = true
      this.handle.style.opacity = 1
      this.update(event.targetTouches[0].pageX, event.targetTouches[0].pageY)
    })

    document.addEventListener('touchend touchcancel', () => {
      this.mouseDown = false
    })

    document.addEventListener('touchmove', event => {
      if (!this.mouseDown) return
      this.update(event.touches[0].pageX, event.touches[0].pageY)
    })
  }

  update (pageX, pageY) {
    this.newLeft = (pageX - this.regionData.offset.left)
    this.newTop = (pageY - this.regionData.offset.top)

    this.distance = Math.pow(this.regionData.centerX - this.newLeft, 2) + Math.pow(this.regionData.centerY - this.newTop, 2)
    if (this.distance > Math.pow(this.regionData.radius, 2)) {
      this.angle = Math.atan2((this.newTop - this.regionData.centerY), (this.newLeft - this.regionData.centerX))
      this.newLeft = (Math.cos(this.angle) * this.regionData.radius) + this.regionData.centerX
      this.newTop = (Math.sin(this.angle) * this.regionData.radius) + this.regionData.centerY
    }
    this.newTop = Math.round(this.newTop * 10) / 10
    this.newLeft = Math.round(this.newLeft * 10) / 10

    this.handle.style.top = this.newTop - this.handleData.radius
    this.handle.style.left = this.newLeft - this.handleData.radius
    let deltaX = this.regionData.centerX - parseInt(this.newLeft)
    let deltaY = this.regionData.centerY - parseInt(this.newTop)

    deltaX = -2 + (2 + 2) * (deltaX - (-this.regionData.radius)) / (this.regionData.radius - (-this.regionData.radius))
    deltaY = -2 + (2 + 2) * (deltaY - (-this.regionData.radius)) / (this.regionData.radius - (-this.regionData.radius))
    deltaX = -1 * Math.round(deltaX * 10) / 10
    deltaY = -1 * Math.round(deltaY * 10) / 10

    this.sendEvent(deltaX, deltaY)
  }

  sendEvent (dx, dy) {
    if (!this.mouseDown) {
      clearTimeout(this.eventRepeatTimeout)
      return
    }

    clearTimeout(this.eventRepeatTimeout)
    this.eventRepeatTimeout = setTimeout(() => {
      this.sendEvent(dx, dy)
    }, 5)

    this.rotationPad.dispatchEvent(
      new CustomEvent('YawPitch', {
        detail: {
          'deltaX': dx,
          'deltaY': dy
        },
        bubbles: false
      })
    )
  }
}
