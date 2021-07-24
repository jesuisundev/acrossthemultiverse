import * as THREE from 'three'
import { Curves } from "three/examples/jsm/curves/CurveExtras"

// GOAL : https://icdn.digitaltrends.com/image/digitaltrends/the-rosy-glow-of-a-cosmic-seagull.jpg

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const nebulaParameters = messageEvent.data.parameters.matters.nebula
  const clusterSize = messageEvent.data.parameters.grid.clusterSize
  const nebulasAttributes = {}

  for (let clusterToPopulate of clustersToPopulate) {
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

    // bright stars following shaped gaz
    const secondPassStarsRandomAttributes = _getShapeAttributesInRandomPosition(
      nebulaParameters,
      gazRandomAttributes.positions,
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
  const positions = enforcedPositions ? enforcedPositions : []
  const colors = enforcedColors ? enforcedColors : []
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
  
  if(!positions.length || !colors.length) {
    const colorInside = new THREE.Color("#FF0000")
    const colorOutside = new THREE.Color("#FFFF00")
    const mixedColor = colorInside.clone()

    for (let i = 0; i < geometry.attributes.position.array.length - 1; i++) {
      const i3 = i * 3

      if(geometry.attributes.position.array[i3]){
        // TODO FIX THIS
        mixedColor.lerp(colorOutside, i / geometry.attributes.position.array.length)
        positions[i3] = geometry.attributes.position.array[i3] * (Math.random() * randomNess + radius)
        colors[i3] = mixedColor.r
      }

      if(geometry.attributes.position.array[i3+1]) {
        mixedColor.lerp(colorOutside, i / geometry.attributes.position.array.length)
        positions[i3 + 1] = geometry.attributes.position.array[i3+1] * (Math.random() * randomNess + radius)
        colors[i3 + 1] = mixedColor.g
      }
        

      if(geometry.attributes.position.array[i3+2]) {
        mixedColor.lerp(colorOutside, i / geometry.attributes.position.array.length)
        positions[i3 + 2] = geometry.attributes.position.array[i3+2] * (Math.random() * randomNess + radius)
        colors[i3 + 2] = mixedColor.b
      }
    }
  }
  
  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  }
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
      parameters.colors[THREE.MathUtils.randInt(0, parameters.colors.length)]
    )

    colors.push(color.r, color.g, color.b)
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  }
}
