import * as THREE from 'three'

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const currentUniverse = messageEvent.data.currentUniverse
  const galaxyParameters = messageEvent.data.parameters.matters[currentUniverse].galaxy
  const clusterSize = messageEvent.data.parameters.grid.clusterSize
  const galaxyAttributes = {}
    const chosenColors = _getTwoDifferentColors(galaxyParameters.galaxyColors)

  for (const clusterToPopulate of clustersToPopulate) {
    // base galaxy shaped
    const firstPassStarsRandomAttributes = _getGalaxyAttributesInRandomPosition()

    // gaz galaxy shaped
    const secondPassStarsRandomAttributes = _getGalaxyAttributesInRandomPosition()

    // low starfield density using color from galaxy
    const thirdPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        galaxyParameters.budget * THREE.MathUtils.randFloat(
          galaxyParameters.vertices.pass.min,
          galaxyParameters.vertices.pass.max
        )
      ),
      clusterSize,
      galaxyParameters,
      chosenColors
    )

    galaxyAttributes[clusterToPopulate] = {
      firstPassStarsRandomAttributes,
      secondPassStarsRandomAttributes,
      thirdPassStarsRandomAttributes
    }
  }

  self.postMessage(galaxyAttributes)
}

function _getGalaxyAttributesInRandomPosition () {
  let currentValueX
  let currentValueY
  let currentValueZ

  const positions = []
  const colors = []
  const randomNess = 5
  const amplitude = 4
  const minPositionAmplitude = 3000
  const maxPositionAmplitude = 8000
  const geometry = new THREE.RingGeometry(14, 15, 300, 300)

  geometry.scale(200, 200, 200)

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

function _getAttributesInRandomPosition (max, clusterSize, parameters, chosenColors) {
  const positions = []
  const colors = []

  for (let i = 0; i < max; i++) {
    // creating coordinate for the particles in random positions but confined in the current square cluster
    const x = clusterSize * Math.random() - (clusterSize / 2) + THREE.MathUtils.randFloat(0, Math.floor(clusterSize / 5))
    const y = clusterSize * Math.random() - (clusterSize / 2) + THREE.MathUtils.randFloat(0, Math.floor(clusterSize / 5))
    const z = clusterSize * Math.random() - (clusterSize / 2) + THREE.MathUtils.randFloat(0, Math.floor(clusterSize / 5))

    positions.push(x, y, z)

    const color = chosenColors.colorOut

    colors.push(color.r, color.g, color.b)
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
