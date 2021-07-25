import * as THREE from 'three'

// TODO GOAL : https://study.com/cimages/videopreview/videopreview-full/je5pi21bpe.jpg

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const nebulaParameters = messageEvent.data.parameters.matters.nebula
  const clusterSize = messageEvent.data.parameters.grid.clusterSize
  const nebulasAttributes = {}

  for (let clusterToPopulate of clustersToPopulate) {
    // gaz shaped
    const gazRandomAttributes = _getRoundAttributesInRandomPosition(
        nebulaParameters,
        Math.floor(
          nebulaParameters.budget * THREE.MathUtils.randFloat(
            nebulaParameters.vertices.cloud.min,
            nebulaParameters.vertices.cloud.max
          )
        ),
        clusterSize
    )

    // random stars to fill emptyness
    const firstPassStarsRandomAttributes = _getAttributesInRandomPosition(
      nebulaParameters,
      Math.floor(
        nebulaParameters.budget * THREE.MathUtils.randFloat(
          nebulaParameters.vertices.pass.min * 0.25,
          nebulaParameters.vertices.pass.max * 0.25
        )
      ),
      clusterSize
    )

    // bright stars
    const secondPassStarsRandomAttributes = _getRoundAttributesInRandomPosition(nebulaParameters)

    // random stars shaped not following gaz
    const thirdPassStarsRandomAttributes = _getRoundAttributesInRandomPosition(nebulaParameters)

    nebulasAttributes[clusterToPopulate] = {
        gazRandomAttributes,
        firstPassStarsRandomAttributes,
        secondPassStarsRandomAttributes,
        thirdPassStarsRandomAttributes
    }
  }

  self.postMessage(nebulasAttributes)
}

function _getAttributesInRandomPosition (parameters, max, clusterSize) {
    const positions = []
    const colors = []
  
    for (let i = 0; i < max; i++) {
      // creating coordinate for the particles in random positions but confined in the current square cluster
      let x = clusterSize * Math.random() - (clusterSize / 2)
      let y = clusterSize * Math.random() - (clusterSize / 2)
      let z = clusterSize * Math.random() - (clusterSize / 2)
  
      positions.push(x, y, z)
  
      const color = new THREE.Color(
        Math.random() > 0.4 ? "#eeefff" : parameters.colors[THREE.MathUtils.randInt(0, parameters.colors.length - 1)]
      )
  
      colors.push(color.r, color.g, color.b)
    }
  
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors)
    }
}

function _getRoundAttributesInRandomPosition (parameters, max, clusterSize) {
  const positions = []
  const colors = []

  for (let i = 0; i < max; i++) {
    const alpha = Math.random() * (Math.PI)
    const theta = Math.random() * (Math.PI)

    let x = clusterSize * (Math.cos(alpha) * Math.sin(theta)) - (clusterSize / 2)
    let y = clusterSize * (Math.sin(alpha) * Math.sin(theta)) - (clusterSize / 2)
    let z = clusterSize * (Math.cos(theta)) - (clusterSize / 2)

    positions.push(x, y, z)

    const color = new THREE.Color(
      Math.random() > 0.4 ? "#eeefff" : parameters.colors[THREE.MathUtils.randInt(0, parameters.colors.length - 1)]
    )

    colors.push(color.r, color.g, color.b)
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  }
}

function _getTwoDifferentColors(pool) {
    const poolCloned = JSON.parse(JSON.stringify(pool))
    const colorIn = new THREE.Color(poolCloned.splice(THREE.MathUtils.randInt(0, poolCloned.length - 1), 1).shift())
    const colorOut = new THREE.Color(poolCloned.splice(THREE.MathUtils.randInt(0, poolCloned.length - 1), 1).shift())

    return { colorIn, colorOut }
}