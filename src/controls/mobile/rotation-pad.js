/*
just force myself to handle fucking mobile devices.
this is a rewrite of http://mese79.github.io/TouchControls/
it's working but its shit, make it better before using it
i hate mobile devices with a fierce passion of a millions suns
 */

export default class RotationPad {
  constructor() {
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
    this.regionData.width = this.rotationPad.offsetWidth
    this.regionData.height = this.rotationPad.offsetHeight
    this.regionData.position = { left: 0, bottom: 0}

    this.regionData.offset = { left: this.rotationPad.offsetLeft, top: this.rotationPad.offsetTop }
    this.regionData.radius = this.regionData.width / 2
    this.regionData.centerX = this.regionData.position.left + this.regionData.radius
    this.regionData.centerY = this.regionData.position.bottom + this.regionData.radius

    this.handleData.width = this.handle.clientWidth
    this.handleData.height = this.handle.clientHeight
    this.handleData.radius = this.handleData.width / 2
    this.regionData.radius = this.regionData.width / 2 - this.handleData.radius
  }

  addEventListener() {
    this.region.addEventListener('touchstart', event => {
      this.mouseDown = true
      this.handle.style.opacity = 1
      this.update(event.targetTouches[0].pageX, event.targetTouches[0].pageY)
    }, { passive: true })

    this.region.addEventListener('touchend', () => {
      this.handle.style.opacity = 0
      this.mouseDown = false
    })

    this.region.addEventListener('touchcancel', () => {
      this.handle.style.opacity = 0
      this.mouseDown = false
    })

    this.region.addEventListener('touchmove', event => {
      if (!this.mouseDown) return

      // this does not exist in Safari, well then FUCK YOU SAFARI
      if(event.changedTouches) {
        if(event.changedTouches[0]?.target?.id == 'rotation-pad-region') {
          this.update(event.changedTouches[0].pageX, event.changedTouches[0].pageY)
        } else {
          this.update(event.changedTouches[1].pageX, event.changedTouches[1].pageY)
        }
      } else {
        this.update(event.touches[0].pageX, event.touches[0].pageY)
      }
    })
  }

  update (pageX, pageY) {
    if(window.sequencer.active) return

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

    this.handle.style.top = `${this.newTop - this.handleData.radius}px`
    this.handle.style.left = `${this.newLeft - this.handleData.radius}px`
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
