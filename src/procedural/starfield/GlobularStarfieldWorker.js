import * as THREE from 'three'

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const starfieldParameters = messageEvent.data.parameters.matters.starfield
  const clusterSize = messageEvent.data.parameters.grid.clusterSize
  const starfieldsAttributes = {}

  for (const clusterToPopulate of clustersToPopulate) {
    const brightStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        starfieldParameters.budget * THREE.MathUtils.randFloat(
          starfieldParameters.vertices.bright.min,
          starfieldParameters.vertices.bright.max
        )
      ),
      clusterSize,
      starfieldParameters
    )

    const firstPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        starfieldParameters.budget * THREE.MathUtils.randFloat(
          starfieldParameters.vertices.globularPass.min,
          starfieldParameters.vertices.globularPass.max
        )
      ),
      clusterSize,
      starfieldParameters
    )

    const secondPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        starfieldParameters.budget * THREE.MathUtils.randFloat(
          starfieldParameters.vertices.globularPass.min,
          starfieldParameters.vertices.globularPass.max
        )
      ),
      clusterSize,
      starfieldParameters
    )

    const thirdPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        starfieldParameters.budget * THREE.MathUtils.randFloat(
          starfieldParameters.vertices.globularPass.min,
          starfieldParameters.vertices.globularPass.max
        )
      ),
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

function _getAttributesInRandomPosition (max, clusterSize, parameters) {
  const positions = []
  const colors = []
  const spherical = new THREE.Spherical()
  const shapeDice = Math.random()
  const colorChosen = parameters.globularColors[THREE.MathUtils.randInt(0, parameters.globularColors.length - 1)]

  for (let i = 0; i < max; i++) {
    // creating coordinate for the particles in random positions but confined in the current sphere cluster
    spherical.phi = Math.random() * Math.PI
    spherical.theta = Math.random() * Math.PI * 2
    spherical.radius = Math.random() * ((clusterSize / 2) + THREE.MathUtils.randFloat(0, Math.floor(clusterSize / 5)))

    const currentVector = new THREE.Vector3().setFromSpherical(spherical)

    // random shapes
    if (shapeDice < 0.1) {
      currentVector.multiply(new THREE.Vector3().random())
    } else if (shapeDice < 0.9) {
      currentVector.cross(new THREE.Vector3().random())
    }

    positions.push(currentVector.x, currentVector.y, currentVector.z)

    const color = new THREE.Color(colorChosen)

    colors.push(color.r, color.g, color.b)
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  }
}
