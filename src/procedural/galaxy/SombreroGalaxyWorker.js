import * as THREE from 'three'

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const currentUniverse = messageEvent.data.currentUniverse
  const galaxyParameters = messageEvent.data.parameters.matters[currentUniverse].galaxy
  const clusterSize = messageEvent.data.parameters.grid.clusterSize
  const galaxyAttributes = {}
  const chosenColors = _getTwoDifferentColors(galaxyParameters.galaxyColors)
  const innerSize = THREE.MathUtils.randInt(14, 15)
  const outerSize = THREE.MathUtils.randInt(3, 4)

  for (const clusterToPopulate of clustersToPopulate) {
    // base galaxy shaped
    const firstPassStarsRandomAttributes = _getGalaxyAttributesInRandomPosition(innerSize, outerSize, 6000, 12000)

    // gaz galaxy shaped
    const secondPassStarsRandomAttributes = _getGalaxyAttributesInRandomPosition(innerSize, outerSize, 1000, 3000)

    // center
    const thirdPassStarsRandomAttributes = _getGalaxyAttributesInRandomPosition(4, 0.00001, 1000, 3000)
    

    galaxyAttributes[clusterToPopulate] = {
      firstPassStarsRandomAttributes,
      secondPassStarsRandomAttributes,
      thirdPassStarsRandomAttributes
    }
  }

  self.postMessage(galaxyAttributes)
}

function _getGalaxyAttributesInRandomPosition (innerSize, outerSize, minPositionAmplitude = 1000, maxPositionAmplitude = 6000, density = 300) {
  let currentValueX
  let currentValueY
  let currentValueZ

  const positions = []
  const colors = []
  const randomNess = THREE.MathUtils.randInt(5, 7)
  const amplitude = THREE.MathUtils.randInt(4, 6)
  const scale = 200
  const geometry = new THREE.RingGeometry(innerSize, outerSize, density, density)

  geometry.scale(scale, scale, scale)

  for (let i = 0; i < geometry.attributes.position.array.length - 1; i++) {
    if(i > 80000) continue;
  
    const i3 = i * 3

    if (geometry.attributes.position.array[i3]) {
      currentValueX = geometry.attributes.position.array[i3] * (Math.random() * randomNess + amplitude )

      if(currentValueX && !isNaN(currentValueX)) {
        positions[i3] = currentValueX + (THREE.MathUtils.randInt(minPositionAmplitude, maxPositionAmplitude) * Math.random()) + randomNess
        colors[i3] = 1
      }
    }

    if (geometry.attributes.position.array[i3 + 1]) {
      currentValueY = geometry.attributes.position.array[i3 + 1] * (Math.random() * randomNess + amplitude )

      if(currentValueY && !isNaN(currentValueY)) {
        positions[i3 + 1] = currentValueY + (THREE.MathUtils.randInt(minPositionAmplitude, maxPositionAmplitude) * Math.random()) + randomNess
        colors[i3 + 1] = 1
      }
    } else {
      positions[i3 + 1] = (randomNess + minPositionAmplitude) * Math.random()
      colors[i3 + 1] = 1
    }

    if (geometry.attributes.position.array[i3 + 2]) {
      currentValueZ = geometry.attributes.position.array[i3 + 2] * (Math.random() * randomNess + amplitude )

      if(currentValueZ && !isNaN(currentValueZ)) {
        positions[i3 + 2] = currentValueZ + ((THREE.MathUtils.randInt(minPositionAmplitude, maxPositionAmplitude) * Math.random()) + randomNess) * (Math.random() > 0.5 ? 1 : -1)
        colors[i3 + 2] = 1
      }
    } else {
      positions[i3 + 2] = (randomNess + THREE.MathUtils.randInt(minPositionAmplitude, maxPositionAmplitude)) * Math.random() * (Math.random() > 0.5 ? 1 : -1)
      colors[i3 + 2] = 1
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  }
}

function _getTwoDifferentColors (pool) {
  const colorIn = new THREE.Color(pool.in[THREE.MathUtils.randInt(0, pool.in.length - 1)])
  const colorOut = new THREE.Color(pool.out[THREE.MathUtils.randInt(0, pool.out.length - 1)])

  return { colorIn, colorOut }
}
