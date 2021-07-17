import * as THREE from 'three'

self.onmessage = messageEvent => {
  const sectorsToPopulate = messageEvent.data.sectorsToPopulate
  const sectorSize = messageEvent.data.sectorSize
  const parameters = messageEvent.data.parameters
  const countMaxByType = Math.floor(parameters.budget / 3)
  const starfieldsAttributes = {}

  for (let sectorToPopulate of sectorsToPopulate) {
    const brightStarsRandomAttributes = _getAttributesInRandomPosition(
      _getRandomNumberBeetwen(Math.floor(countMaxByType / 0.5), countMaxByType),
      sectorToPopulate,
      sectorSize,
      parameters
    )
    const normalStarsRandomAttributes = _getAttributesInRandomPosition(
      _getRandomNumberBeetwen(Math.floor(countMaxByType / 2), countMaxByType),
      sectorToPopulate,
      sectorSize,
      parameters
    )
    const paleStarsRandomAttributes = _getAttributesInRandomPosition(
      _getRandomNumberBeetwen(Math.floor(countMaxByType / 4), countMaxByType),
      sectorToPopulate,
      sectorSize,
      parameters
    )

    starfieldsAttributes[sectorToPopulate] = {
        brightStarsRandomAttributes,
        normalStarsRandomAttributes,
        paleStarsRandomAttributes
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
      parameters.colors[Math.floor(_getRandomNumberBeetwen(0, parameters.colors.length))]
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
