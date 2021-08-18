import * as THREE from 'three'

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const galaxyParameters = messageEvent.data.parameters.matters.galaxy
  const clusterSize = messageEvent.data.parameters.grid.clusterSize
  const galaxyAttributes = {}
  const defaultBranchesNumber = THREE.MathUtils.randInt(galaxyParameters.elliptical.branches.min, galaxyParameters.elliptical.branches.max)
  const chosenColors = _getTwoDifferentColors(galaxyParameters.galaxyColors)

  for (const clusterToPopulate of clustersToPopulate) {
    // base galaxy shaped
    const firstPassStarsRandomAttributes = _getGalaxyAttributesInRandomPosition(
      Math.floor(
        galaxyParameters.budget * THREE.MathUtils.randFloat(
          galaxyParameters.vertices.pass.min,
          galaxyParameters.vertices.pass.max
        )
      ),
      clusterSize,
      galaxyParameters,
      chosenColors,
      defaultBranchesNumber
    )

    // gaz galaxy shaped
    const secondPassStarsRandomAttributes = _getGalaxyAttributesInRandomPosition(
      Math.floor(
        galaxyParameters.budget * THREE.MathUtils.randFloat(
          galaxyParameters.vertices.cloud.min * 0.6,
          galaxyParameters.vertices.cloud.max * 0.6
        )
      ),
      clusterSize,
      galaxyParameters,
      chosenColors,
      defaultBranchesNumber
    )

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

function _getGalaxyAttributesInRandomPosition (max, clusterSize, parameters, chosenColors, enforcedBranches) {
  const positions = []
  const colors = []
  const radius = clusterSize / 1.8
  const branches = enforcedBranches || THREE.MathUtils.randInt(parameters.elliptical.branches.min, parameters.elliptical.branches.max)
  const spin = THREE.MathUtils.randInt(parameters.elliptical.spin.min, parameters.elliptical.spin.max)
  const mixedColor = chosenColors.colorIn.clone()

  for (let i = 0; i < max; i++) {
    const i3 = i * 3
    const randomRadiusPosition = Math.random() * radius + Math.random()
    const spinAngle = spin
    const branchAngle = Math.PI

    const x = Math.pow(
      Math.random(),
      parameters.elliptical.randomnessPower
    ) * parameters.elliptical.randomness * randomRadiusPosition

    const y = Math.pow(
      Math.random(),
      parameters.elliptical.randomnessPower
    ) * (Math.random() < 0.5 ? 1 : -1) * parameters.elliptical.randomness * randomRadiusPosition

    const z = Math.pow(
      Math.random(),
      parameters.elliptical.randomnessPower
    ) * (Math.random() < 0.5 ? 1 : -1) * parameters.elliptical.randomness * randomRadiusPosition

    positions[i3] = Math.cos(branchAngle) * randomRadiusPosition + x
    positions[i3 + 1] = y
    positions[i3 + 2] = Math.sin(branchAngle) * randomRadiusPosition + z

    mixedColor.lerpColors(
      chosenColors.colorIn,
      chosenColors.colorOut,
      (randomRadiusPosition / radius) + parameters.elliptical.colorInterpolationAmplitude
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
