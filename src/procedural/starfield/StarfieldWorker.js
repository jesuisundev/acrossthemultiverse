import * as THREE from 'three'

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const starfieldParameters = messageEvent.data.parameters.matters.starfield
  const clusterSize = messageEvent.data.parameters.grid.clusterSize
  const starfieldsAttributes = {}

  for (let clusterToPopulate of clustersToPopulate) {
    const brightStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        starfieldParameters.budget * THREE.MathUtils.randFloat(
          starfieldParameters.vertices.bright.min,
          starfieldParameters.vertices.bright.max
        )
      ),
      clusterToPopulate,
      clusterSize,
      starfieldParameters
    )

    const firstPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        starfieldParameters.budget * THREE.MathUtils.randFloat(
          starfieldParameters.vertices.pass.min,
          starfieldParameters.vertices.pass.max
        )
      ),
      clusterToPopulate,
      clusterSize,
      starfieldParameters
    )

    const secondPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        starfieldParameters.budget * THREE.MathUtils.randFloat(
          starfieldParameters.vertices.pass.min,
          starfieldParameters.vertices.pass.max
        )
      ),
      clusterToPopulate,
      clusterSize,
      starfieldParameters
    )

    const thirdPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        starfieldParameters.budget * THREE.MathUtils.randFloat(
          starfieldParameters.vertices.pass.min,
          starfieldParameters.vertices.pass.max
        )
      ),
      clusterToPopulate,
      clusterSize,
      starfieldParameters
    )

    starfieldsAttributes[clusterToPopulate] = {
        brightStarsRandomAttributes,
        firstPassStarsRandomAttributes,
        secondPassStarsRandomAttributes,
        thirdPassStarsRandomAttributes
    }
  }

  self.postMessage(starfieldsAttributes)
}

function _getAttributesInRandomPosition (max, currentCluster, clusterSize, parameters) {
  const positions = []
  const colors = []

  for (let i = 0; i < max; i++) {
    // creating coordinate for the particles in random positions but confined in the current square cluster
    let x = clusterSize * Math.random() - (clusterSize / 2)
    let y = clusterSize * Math.random() - (clusterSize / 2)
    let z = clusterSize * Math.random() - (clusterSize / 2)

    // we dont need to tweak coordinates on the origin cluster
    if (currentCluster != '0,0,0') {
      const arrayCurrentCluster = currentCluster.split(',')

      // handling x axis (right and left) clusters population
      const xCurrentCluster = parseInt(arrayCurrentCluster[0])

      if (xCurrentCluster != 0) {
          x = clusterSize * (Math.random() + xCurrentCluster) - (clusterSize / 2)
      }

      // since we're not handling vertical movement at the moment
      // we dont need to handle the y axis

      // handling z axis (forward and backward) clusters population
      const zCurrentCluster = parseInt(arrayCurrentCluster[2])

      if (zCurrentCluster != 0) {
        z = clusterSize * (Math.random() + zCurrentCluster) - (clusterSize / 2)
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
