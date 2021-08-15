import * as THREE from 'three'

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const galaxyParameters = messageEvent.data.parameters.matters.galaxy
  const clusterSize = messageEvent.data.parameters.grid.clusterSize
  const galaxyAttributes = {}
  const defaultBranchesNumber = THREE.MathUtils.randInt(galaxyParameters.spiral.branches.min, galaxyParameters.spiral.branches.max)

  for (const clusterToPopulate of clustersToPopulate) {
    // base galaxy shaped
    const firstPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        galaxyParameters.budget * THREE.MathUtils.randFloat(
          galaxyParameters.vertices.pass.min,
          galaxyParameters.vertices.pass.max
        )
      ),
      clusterSize,
      galaxyParameters,
      defaultBranchesNumber
    )

    // gaz galaxy shaped
    // todo - maybe i dont need to recalulte this. could i pass the other attributes; less random tho
    const secondPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        galaxyParameters.budget * THREE.MathUtils.randFloat(
          galaxyParameters.vertices.cloud.min * 0.7,
          galaxyParameters.vertices.cloud.max * 0.7
        )
      ),
      clusterSize,
      galaxyParameters,
      defaultBranchesNumber
    )

    galaxyAttributes[clusterToPopulate] = {
      firstPassStarsRandomAttributes,
      secondPassStarsRandomAttributes
    }
  }

  self.postMessage(galaxyAttributes)
}

function _getAttributesInRandomPosition (max, clusterSize, parameters, enforcedBranches) {
  const positions = []
  const colors = []
  const radius = clusterSize / 1.8
  const branches = enforcedBranches || THREE.MathUtils.randInt(parameters.spiral.branches.min, parameters.spiral.branches.max)
  const spin = THREE.MathUtils.randInt(parameters.spiral.spin.min, parameters.spiral.spin.max)
  const chosenColors = _getTwoDifferentColors(parameters.galaxyColors)
  const mixedColor = chosenColors.colorIn.clone()

  for (let i = 0; i < max; i++) {
    const i3 = i * 3
    const randomRadiusPosition = Math.random() * radius
    const spinAngle = (randomRadiusPosition * 0.0001) * spin
    const branchAngle = (i % branches) / branches * Math.PI * 2

    const x = Math.pow(
      Math.random(),
      parameters.spiral.randomnessPower
    ) * (Math.random() < 0.5 ? 1 : -1) * parameters.spiral.randomness * randomRadiusPosition

    const y = Math.pow(
      Math.random(),
      parameters.spiral.randomnessPower
    ) * (Math.random() < 0.5 ? 1 : -1) * parameters.spiral.randomness * randomRadiusPosition

    const z = Math.pow(
      Math.random(),
      parameters.spiral.randomnessPower
    ) * (Math.random() < 0.5 ? 1 : -1) * parameters.spiral.randomness * randomRadiusPosition

    positions[i3] = Math.cos(branchAngle + spinAngle) * randomRadiusPosition + x
    positions[i3 + 1] = y
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * randomRadiusPosition + z

    mixedColor.lerpColors(
      chosenColors.colorIn,
      chosenColors.colorOut,
      randomRadiusPosition / radius
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

function _getTwoDifferentColors (pool) {
  const colorIn = new THREE.Color(pool.in[THREE.MathUtils.randInt(0, pool.in.length - 1)])
  const colorOut = new THREE.Color(pool.out[THREE.MathUtils.randInt(0, pool.out.length - 1)])

  return { colorIn, colorOut }
}
