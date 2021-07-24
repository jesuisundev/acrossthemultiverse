import * as THREE from 'three'
import { Curves } from "three/examples/jsm/curves/CurveExtras"

// GOAL : https://icdn.digitaltrends.com/image/digitaltrends/the-rosy-glow-of-a-cosmic-seagull.jpg

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const nebulaParameters = messageEvent.data.parameters.matters.nebula
  const nebulasAttributes = {}

  for (let clusterToPopulate of clustersToPopulate) {
    const cloudRandomAttributes = _getAttributesInRandomPosition(nebulaParameters)
    const firstPassStarsRandomAttributes = _getAttributesInRandomPosition(nebulaParameters)
    const secondPassStarsRandomAttributes = _getAttributesInRandomPosition(nebulaParameters)
    const thirdPassStarsRandomAttributes = _getAttributesInRandomPosition(nebulaParameters)

    nebulasAttributes[clusterToPopulate] = {
        cloudRandomAttributes,
        firstPassStarsRandomAttributes,
        secondPassStarsRandomAttributes,
        thirdPassStarsRandomAttributes
    }
  }

  self.postMessage(nebulasAttributes)
}

function _getAttributesInRandomPosition (parameters) {
  const positions = []
  const colors = []

  // TODO - test each combinaison to get the perfect feeeling
  // one pass cloud, one pass trail, one pur starfield, on pass bright
  // cant be white
  const geometry = new THREE.TubeGeometry(
    new Curves.CinquefoilKnot(),
    parameters.vertices.emission.tubularSegments,
    parameters.vertices.emission.radius,
    parameters.vertices.emission.radiusSegments,
    parameters.vertices.emission.closed
  )

  geometry.scale(100, 100, 100)

  for (let i = 0; i < geometry.attributes.position.array.length - 1; i++) {
    const i3 = i * 3
    const randomNess = 4
    const radius = 5

    if(geometry.attributes.position.array[i3])
      positions[i3] = geometry.attributes.position.array[i3] * (Math.random() * randomNess + radius)

    if(geometry.attributes.position.array[i3+1])
      positions[i3 + 1] = geometry.attributes.position.array[i3+1] * (Math.random() * randomNess + radius)

    if(geometry.attributes.position.array[i3+2])
      positions[i3 + 2] = geometry.attributes.position.array[i3+2] * (Math.random() * randomNess + radius)

    const color = new THREE.Color(
        Math.random() > 0.4 ? "#eeefff" : parameters.colors[Math.floor(THREE.MathUtils.randInt(0, parameters.colors.length))]
    )
    colors.push(color.r, color.g, color.b)
    // TODO - lerp game here
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  }
}

// function _getRandomCurve () {
//   const randomIndex = THREE.MathUtils.randInt(1, 5)

//   switch (randomIndex) {
//     case 1:
//       return new Curves.CinquefoilKnot()
    
//     case 2:
//       return new Curves.VivianiCurve()

//     case 3:
//       return new Curves.KnotCurve()
    
//     case 4:
//         return new Curves.HelixCurve()

//     case 5:
//         return new Curves.DecoratedTorusKnot5c()

//     default:
//         return new Curves.CinquefoilKnot()
//   }
// }
