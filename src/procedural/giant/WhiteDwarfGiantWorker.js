import * as THREE from 'three'

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const giantParameters = messageEvent.data.parameters.matters[messageEvent.data.currentUniverse].giant
  const clusterSize = messageEvent.data.parameters.grid.clusterSize
  const giantAttributes = {}

  for (const clusterToPopulate of clustersToPopulate) {
    const firstPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        giantParameters.budget * THREE.MathUtils.randFloat(
          giantParameters.vertices.pass.min,
          giantParameters.vertices.pass.max
        )
      ),
      clusterSize,
      giantParameters
    )

    giantAttributes[clusterToPopulate] = {
      firstPassStarsRandomAttributes
    }
  }

  self.postMessage(giantAttributes)
}

function _getAttributesInRandomPosition (max, clusterSize, parameters) {
  const positions = []
  const colors = []

  for (let i = 0; i < max; i++) {
    // creating coordinate for the particles in random positions but confined in the current square cluster
    const x = clusterSize * Math.random() - (clusterSize / 2) + THREE.MathUtils.randFloat(0, Math.floor(clusterSize / 5))
    const y = clusterSize * Math.random() - (clusterSize / 2) + THREE.MathUtils.randFloat(0, Math.floor(clusterSize / 5))
    const z = clusterSize * Math.random() - (clusterSize / 2) + THREE.MathUtils.randFloat(0, Math.floor(clusterSize / 5))

    positions.push(x, y, z)

    const color = new THREE.Color(
      Math.random() > 0.4 ? '#eeefff' : parameters.colors[THREE.MathUtils.randInt(0, parameters.colors.length - 1)]
    )

    colors.push(color.r, color.g, color.b)
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  }
}
