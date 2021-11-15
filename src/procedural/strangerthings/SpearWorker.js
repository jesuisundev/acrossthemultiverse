import * as THREE from 'three'

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const strangerThingsParameters = messageEvent.data.currentUniverse.matters.strangerthings.spear
  const strangerThingsAttributes = {}
  const clusterSize = messageEvent.data.parameters.grid.clusterSize

  for (const clusterToPopulate of clustersToPopulate) {
    // base galaxy shaped
    const firstPassStarsRandomAttributes = _getCyclicAttributesInRandomPosition(
      Math.floor(
        strangerThingsParameters.budget * THREE.MathUtils.randFloat(
            strangerThingsParameters.vertices.pass.min,
            strangerThingsParameters.vertices.pass.max
        )
      ),
      clusterSize,
      strangerThingsParameters
    )

    // gaz galaxy shaped
    const secondPassStarsRandomAttributes = _getCyclicAttributesInRandomPosition(
      Math.floor(
        strangerThingsParameters.budget * THREE.MathUtils.randFloat(
            strangerThingsParameters.vertices.cloud.min * 0.6,
            strangerThingsParameters.vertices.cloud.max * 0.6
        )
      ),
      clusterSize,
      strangerThingsParameters
    )

    // low starfield density using color from galaxy
    const thirdPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        strangerThingsParameters.budget * THREE.MathUtils.randFloat(
            strangerThingsParameters.vertices.pass.min * 0.01,
            strangerThingsParameters.vertices.pass.max * 0.01
        )
      ),
      clusterSize,
      strangerThingsParameters
    )
            
    strangerThingsAttributes[clusterToPopulate] = {
      firstPassStarsRandomAttributes,
      secondPassStarsRandomAttributes,
      thirdPassStarsRandomAttributes
    }
  }

  self.postMessage(strangerThingsAttributes)
}

function _getCyclicAttributesInRandomPosition (max, clusterSize, parameters) {
  const chosenColors = _getTwoDifferentColors(parameters.colors)
  const positions = []
  const colors = []
  const radius = clusterSize * 20
  const mixedColor = chosenColors.colorIn.clone()

  for (let i = 0; i < max; i++) {
      const i3 = i * 3
      const randomRadiusPosition = Math.random() * radius + Math.random()

      const x = Math.pow(
      Math.random(),
      parameters.spiral.randomnessPower
      ) * parameters.spiral.randomness * randomRadiusPosition

      const y = Math.pow(
      Math.random(),
      parameters.spiral.randomnessPower
      ) * (Math.random() < 0.5 ? 1 : -1) * parameters.spiral.randomness * randomRadiusPosition

      const z = Math.pow(
      Math.random(),
      parameters.spiral.randomnessPower
      ) * (Math.random() < 0.5 ? 1 : -1) * parameters.spiral.randomness * randomRadiusPosition

      positions[i3] = randomRadiusPosition * 5 + x
      positions[i3 + 1] = y *5
      positions[i3 + 2] = randomRadiusPosition * 5 + z

      mixedColor.lerpColors(
      chosenColors.colorIn,
      chosenColors.colorOut,
      (randomRadiusPosition / radius) + parameters.spiral.colorInterpolationAmplitude
      )

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
  }

  return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors)
  }
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

    colors.push(1, 0, 0)
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
