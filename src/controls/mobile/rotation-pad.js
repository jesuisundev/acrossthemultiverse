'use strict'

function RotationPad (container) {
  let mouseDown = false
  let eventRepeatTimeout
  let newLeft, newTop, distance, angle
  let self = this

  self.container = container
  self.regionData = {}
  self.handleData = {}
  self.rotationPad = $('<div class="rotation-pad"></div>')
  self.region = $('<div class="region"></div>')
  self.handle = $('<div class="handle"></div>')

  self.rotationPad.append(self.region).append(self.handle)
  self.container.append(self.rotationPad)

  // Aligning pad:
  self.rotationPad.css({
    top: self.container.find('canvas').height() + self.container.position().top - self.region.outerHeight() - 10,
    left: self.container.find('canvas').width() - self.region.outerWidth() - 20
  })

  self.regionData.width = self.region.outerWidth()
  self.regionData.height = self.region.outerHeight()
  self.regionData.position = self.region.position()
  self.regionData.offset = self.region.offset()
  self.regionData.radius = self.regionData.width / 2
  self.regionData.centerX = self.regionData.position.left + self.regionData.radius
  self.regionData.centerY = self.regionData.position.top + self.regionData.radius

  self.handleData.width = self.handle.outerWidth()
  self.handleData.height = self.handle.outerHeight()
  self.handleData.radius = self.handleData.width / 2

  self.regionData.radius = self.regionData.width / 2 - self.handleData.radius

  // Mouse events:
  self.region.on('mousedown', function (event) {
    mouseDown = true
    self.handle.css('opacity', '1.0')
    update(event.pageX, event.pageY)
  })

  $(document).on('mouseup', function () {
    mouseDown = false
    self.resetHandlePosition()
  })

  $(document).on('mousemove', function (event) {
    if (!mouseDown) return
    update(event.pageX, event.pageY)
  })

  // Touch events:
  self.region.on('touchstart', function (event) {
    mouseDown = true
    self.handle.css('opacity', '1.0')
    update(event.originalEvent.targetTouches[0].pageX, event.originalEvent.targetTouches[0].pageY)
  })

  $(document).on('touchend touchcancel', function () {
    mouseDown = false
    self.resetHandlePosition()
  })

  $(document).on('touchmove', function (event) {
    if (!mouseDown) return
    update(event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY)
  })


  function update (pageX, pageY) {
    newLeft = (pageX - self.regionData.offset.left)
    newTop = (pageY - self.regionData.offset.top)

    // If handle reaches the pad boundaries.
    distance = Math.pow(self.regionData.centerX - newLeft, 2) + Math.pow(self.regionData.centerY - newTop, 2)
    if (distance > Math.pow(self.regionData.radius, 2)) {
      angle = Math.atan2((newTop - self.regionData.centerY), (newLeft - self.regionData.centerX))
      newLeft = (Math.cos(angle) * self.regionData.radius) + self.regionData.centerX
      newTop = (Math.sin(angle) * self.regionData.radius) + self.regionData.centerY
    }
    newTop = Math.round(newTop * 10) / 10
    newLeft = Math.round(newLeft * 10) / 10

    self.handle.css({
      top: newTop - self.handleData.radius,
      left: newLeft - self.handleData.radius
    })

    // Providing event and data for handling camera movement.
    let deltaX = self.regionData.centerX - parseInt(newLeft)
    let deltaY = self.regionData.centerY - parseInt(newTop)

    // Normalize x,y between -2 to 2 range.
    deltaX = -2 + (2 + 2) * (deltaX - (-self.regionData.radius)) / (self.regionData.radius - (-self.regionData.radius))
    deltaY = -2 + (2 + 2) * (deltaY - (-self.regionData.radius)) / (self.regionData.radius - (-self.regionData.radius))
    deltaX = -1 * Math.round(deltaX * 10) / 10
    deltaY = -1 * Math.round(deltaY * 10) / 10

    sendEvent(deltaX, deltaY)
  }

  function sendEvent (dx, dy) {
    if (!mouseDown) {
      clearTimeout(eventRepeatTimeout)
      return
    }

    clearTimeout(eventRepeatTimeout)
    eventRepeatTimeout = setTimeout(function () {
      sendEvent(dx, dy)
    }, 5)

    let moveEvent = $.Event('YawPitch', {
      detail: {
        'deltaX': dx,
        'deltaY': dy
      },
      bubbles: false
    })
    $(self).trigger(moveEvent)
  }

  self.resetHandlePosition()
}

RotationPad.prototype = {
  resetHandlePosition: function () {
    this.handle.animate({
      top: this.regionData.centerY - this.handleData.radius,
      left: this.regionData.centerX - this.handleData.radius,
      opacity: 0.1
    }, 'fast')
  }
}
