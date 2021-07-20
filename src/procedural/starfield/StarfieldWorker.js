import * as THREE from 'three'

self.onmessage = messageEvent => {
  const sectorsToPopulate = messageEvent.data.sectorsToPopulate
  const starfieldParameters = messageEvent.data.parameters.matters.starfield
  const sectorSize = messageEvent.data.parameters.grid.sectorSize
  const starfieldsAttributes = {}

  for (let sectorToPopulate of sectorsToPopulate) {
    const brightStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(starfieldParameters.budget * 0.0001),
      sectorToPopulate,
      sectorSize,
      starfieldParameters
    )

    const firstPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(starfieldParameters.budget * 0.20),
      sectorToPopulate,
      sectorSize,
      starfieldParameters
    )

    const secondPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(starfieldParameters.budget * 0.20),
      sectorToPopulate,
      sectorSize,
      starfieldParameters
    )

    const thirdPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(starfieldParameters.budget * 0.20),
      sectorToPopulate,
      sectorSize,
      starfieldParameters
    )

    starfieldsAttributes[sectorToPopulate] = {
        brightStarsRandomAttributes,
        firstPassStarsRandomAttributes,
        secondPassStarsRandomAttributes,
        thirdPassStarsRandomAttributes
    }
  }

  self.postMessage(starfieldsAttributes)
}

function _getAttributesInRandomPosition (max, currentSector, sectorSize, parameters) {
  const positions = []
  const colors = []

  for (let i = 0; i < max; i++) {
    // creating coordinate for the particles in random positions but confined in the current square sector
    let x = sectorSize * Math.random() - (sectorSize / 2)
    let y = sectorSize * Math.random() - (sectorSize / 2)
    let z = sectorSize * Math.random() - (sectorSize / 2)

    // we dont need to tweak coordinates on the origin sector
    if (currentSector != '0,0,0') {
      const arrayCurrentSector = currentSector.split(',')

      // handling x axis (right and left) sectors population
      const xCurrentSector = parseInt(arrayCurrentSector[0])

      if (xCurrentSector != 0) {
          x = sectorSize * (Math.random() + xCurrentSector) - (sectorSize / 2)
      }

      // since we're not handling vertical movement at the moment
      // we dont need to handle the y axis

      // handling z axis (forward and backward) sectors population
      const zCurrentSector = parseInt(arrayCurrentSector[2])

      if (zCurrentSector != 0) {
        z = sectorSize * (Math.random() + zCurrentSector) - (sectorSize / 2)
      }
    }

    positions.push(x, y, z)

    const color = new THREE.Color(
      Math.random() > 0.4 ? "#eeefff" : parameters.colors[Math.floor(_getRandomNumberBeetwen(0, parameters.colors.length))]
    )

    colors.push(color.r, color.g, color.b)
  }

  

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  }
}

function _getRandomNumberBeetwen (min, max) {
  return Math.random() * (max - min) + min
}
