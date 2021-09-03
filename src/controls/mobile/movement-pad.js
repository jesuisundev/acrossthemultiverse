'use strict'

export default class MovementPad {
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
    this.movementPad = document.getElementById('movement-pad')
    this.region = document.getElementById('movement-pad-region')
    this.handle = document.getElementById('movement-pad-handle')

    this.aligningPad()
    this.addEventListener()
  }

  aligningPad() {
    this.movementPad.style.top = this.container.style.height + this.container.style.top - this.region.style.height - 10
    this.movementPad.style.left = 20
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
      this.handle.css('opacity', '1.0')
      this.update(event.pageX, event.pageY)
    })

    document.addEventListener('mouseup', () => {
      this.mouseDown = false
      this.resetHandlePosition()
    })

    document.addEventListener('mousemove', event => {
      if (!this.mouseDown) return
      this.update(event.pageX, event.pageY)
    })

    this.region.addEventListener('touchstart', event => {
      this.mouseDown = true
      this.handle.css('opacity', '1.0')
      this.update(event.originalEvent.targetTouches[0].pageX, event.originalEvent.targetTouches[0].pageY)
    })

    document.addEventListener('touchend touchcancel', () => {
      this.mouseDown = false
      this.resetHandlePosition()
    })

    document.addEventListener('touchmove', event => {
      if (!this.mouseDown) return
      this.update(event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY)
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

    this.handle.css({
      top: this.newTop - this.handleData.radius,
      left: this.newLeft - this.handleData.radius
    })

    let deltaX = this.regionData.centerX - parseInt(this.newLeft)
    let deltaY = this.regionData.centerY - parseInt(this.newTop)

    deltaX = -2 + (2 + 2) * (deltaX - (-this.regionData.radius)) / (this.regionData.radius - (-this.regionData.radius))
    deltaY = -2 + (2 + 2) * (deltaY - (-this.regionData.radius)) / (this.regionData.radius - (-this.regionData.radius))
    deltaX = Math.round(deltaX * 10) / 10
    deltaY = Math.round(deltaY * 10) / 10

    this.sendEvent(deltaX, deltaY, 0)
  }

  sendEvent (dx, dy, middle) {
    if (!this.mouseDown) {
      clearTimeout(this.eventRepeatTimeout)
      let stopEvent = $.Event('stopMove', {
        bubbles: false
      })
      $(self).trigger(stopEvent)

      return
    }

    clearTimeout(eventRepeatTimeout)
    eventRepeatTimeout = setTimeout(function () {
      this.sendEvent(dx, dy, middle)
    }, 5)

    let moveEvent = $.Event('move', {
      detail: {
        'deltaX': dx,
        'deltaY': dy,
        'middle': middle
      },
      bubbles: false
    })
    $(self).trigger(moveEvent)
  }

  resetHandlePosition() {
    this.handle.animate({
      top: this.regionData.centerY - this.handleData.radius,
      left: this.regionData.centerX - this.handleData.radius,
      opacity: 0.1
    }, 'fast')
  }
}
