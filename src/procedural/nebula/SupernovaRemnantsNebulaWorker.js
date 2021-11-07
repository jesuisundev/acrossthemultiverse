import * as THREE from 'three'

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const nebulaParameters = messageEvent.data.currentUniverse.matters.nebula
  const clusterSize = messageEvent.data.parameters.grid.clusterSize
  const nebulasAttributes = {}

  for (const clusterToPopulate of clustersToPopulate) {
    // giant gaz sphere shaped
    const gazRandomAttributes = _getRoundAttributesInRandomPosition(
      nebulaParameters,
      Math.floor(
        nebulaParameters.budget * THREE.MathUtils.randFloat(
          nebulaParameters.vertices.cloud.min * 0.3,
          nebulaParameters.vertices.cloud.max * 0.3
        )
      ),
      clusterSize,
      THREE.MathUtils.randInt(3000, 5000)
    )

    // random stars shaped following giant gaz
    const firstPassStarsRandomAttributes = _getRoundAttributesInRandomPosition(
      nebulaParameters,
      Math.floor(
        nebulaParameters.budget * THREE.MathUtils.randFloat(
          nebulaParameters.vertices.pass.min * 0.5,
          nebulaParameters.vertices.pass.max * 0.5
        )
      ),
      clusterSize
    )

    // small gaz sphere shaped (inside)
    const secondPassStarsRandomAttributes = _getRoundAttributesInRandomPosition(
      nebulaParameters,
      Math.floor(
        nebulaParameters.budget * THREE.MathUtils.randFloat(
          nebulaParameters.vertices.cloud.min * 0.05,
          nebulaParameters.vertices.cloud.max * 0.05
        )
      ),
      clusterSize * 0.5
    )

    // random stars to fill emptyness
    const thirdPassStarsRandomAttributes = _getAttributesInRandomPosition(
      nebulaParameters,
      Math.floor(
        nebulaParameters.budget * THREE.MathUtils.randFloat(
          nebulaParameters.vertices.pass.min * 0.5,
          nebulaParameters.vertices.pass.max * 0.5
        )
      ),
      clusterSize
    )

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
    const x = clusterSize * Math.random() - (clusterSize / 2) + THREE.MathUtils.randFloat(0, Math.floor(clusterSize / 5))
    const y = clusterSize * Math.random() - (clusterSize / 2) + THREE.MathUtils.randFloat(0, Math.floor(clusterSize / 5))
    const z = clusterSize * Math.random() - (clusterSize / 2) + THREE.MathUtils.randFloat(0, Math.floor(clusterSize / 5))

    positions.push(x, y, z)

    const color = new THREE.Color(
      Math.random() > 0.2 ? '#eeefff' : parameters.colors[THREE.MathUtils.randInt(0, parameters.colors.length - 1)]
    )

    colors.push(color.r, color.g, color.b)
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  }
}

function _getRoundAttributesInRandomPosition (parameters, max, clusterSize, distordedAmplitude = 10000) {
  const positions = []
  const colors = []
  const radius = clusterSize / 3
  const chosenColors = _getTwoDifferentColors(parameters.remnantColors)
  const mixedColor = chosenColors.colorIn.clone()

  for (let i = 0; i < max; i++) {
    // creating coordinate for the particles in random positions but confined in the current sphere cluster
    const alpha = Math.random() * (Math.PI)
    const theta = Math.random() * (Math.PI * 2)
    const x = radius * (Math.cos(alpha) * Math.sin(theta)) - radius - THREE.MathUtils.randFloat(0, distordedAmplitude)
    const y = radius * (Math.sin(alpha) * Math.sin(theta)) - radius
    const z = radius * (Math.cos(theta)) - radius - THREE.MathUtils.randFloat(0, distordedAmplitude)

    positions.push(x, y, z)

    mixedColor.lerpColors(chosenColors.colorIn, chosenColors.colorOut, Math.sin(i))
    colors.push(mixedColor.r, mixedColor.g, mixedColor.b)
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
