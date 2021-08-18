import * as THREE from 'three'
import { Curves } from 'three/examples/jsm/curves/CurveExtras'

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const nebulaParameters = messageEvent.data.parameters.matters.nebula
  const clusterSize = messageEvent.data.parameters.grid.clusterSize
  const nebulasAttributes = {}

  for (const clusterToPopulate of clustersToPopulate) {
    // gaz shaped
    const gazRandomAttributes = _getShapeAttributesInRandomPosition(nebulaParameters)

    // random stars to fill emptyness
    const firstPassStarsRandomAttributes = _getAttributesInRandomPosition(
      nebulaParameters,
      Math.floor(
        nebulaParameters.budget * THREE.MathUtils.randFloat(
          nebulaParameters.vertices.pass.min,
          nebulaParameters.vertices.pass.max
        )
      ),
      clusterSize
    )

    // bright stars
    const secondPassStarsRandomAttributes = _getAttributesInRandomPosition(
      nebulaParameters,
      Math.floor(
        nebulaParameters.budget * THREE.MathUtils.randFloat(
          nebulaParameters.vertices.bright.min,
          nebulaParameters.vertices.bright.max
        )
      ),
      clusterSize,
      false,
      gazRandomAttributes.colors
    )

    // random stars shaped not following gaz
    const thirdPassStarsRandomAttributes = _getShapeAttributesInRandomPosition(nebulaParameters)

    nebulasAttributes[clusterToPopulate] = {
      gazRandomAttributes,
      firstPassStarsRandomAttributes,
      secondPassStarsRandomAttributes,
      thirdPassStarsRandomAttributes
    }
  }

  self.postMessage(nebulasAttributes)
}

function _getShapeAttributesInRandomPosition (parameters, enforcedPositions, enforcedColors) {
  const positions = enforcedPositions || []
  const colors = enforcedColors || []
  const randomNess = 4
  const radius = 5

  const geometry = new THREE.TubeGeometry(
    new Curves.CinquefoilKnot(),
    parameters.vertices.emission.tubularSegments,
    parameters.vertices.emission.radius,
    parameters.vertices.emission.radiusSegments,
    parameters.vertices.emission.closed
  )

  geometry.scale(80, 80, 80)

  if (!positions.length || !colors.length) {
    const chosenColors = _getTwoDifferentColors(parameters.colors)
    const mixedColor = chosenColors.colorIn.clone()

    for (let i = 0; i < geometry.attributes.position.array.length - 1; i++) {
      const i3 = i * 3

      mixedColor.lerpColors(chosenColors.colorIn, chosenColors.colorOut, Math.sin(i))

      if (geometry.attributes.position.array[i3]) {
        positions[i3] = geometry.attributes.position.array[i3] * (Math.random() * randomNess + radius)
        colors[i3] = mixedColor.r
      }

      if (geometry.attributes.position.array[i3 + 1]) {
        positions[i3 + 1] = geometry.attributes.position.array[i3 + 1] * (Math.random() * randomNess + radius)
        colors[i3 + 1] = mixedColor.g
      }

      if (geometry.attributes.position.array[i3 + 2]) {
        positions[i3 + 2] = geometry.attributes.position.array[i3 + 2] * (Math.random() * randomNess + radius)
        colors[i3 + 2] = mixedColor.b
      }
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

function _getAttributesInRandomPosition (parameters, max, clusterSize, enforcedPositions = false, enforcedColors = false) {
  const positions = enforcedPositions || []
  const colors = enforcedColors || []

  for (let i = 0; i < max; i++) {
    // creating coordinate for the particles in random positions but confined in the current square cluster
    if (!enforcedPositions) {
      const x = clusterSize * Math.random() - (clusterSize / 2)
      const y = clusterSize * Math.random() - (clusterSize / 2)
      const z = clusterSize * Math.random() - (clusterSize / 2)

      positions.push(x, y, z)
    }

    if (!enforcedColors) {
      const color = new THREE.Color(
        Math.random() > 0.2 ? '#eeefff' : parameters.colors[THREE.MathUtils.randInt(0, parameters.colors.length - 1)]
      )

      colors.push(color.r, color.g, color.b)
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  }
}
