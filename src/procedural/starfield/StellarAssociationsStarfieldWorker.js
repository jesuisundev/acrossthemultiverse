// this is just not working the way i want it to
// might try to make it work later
// or can you ?

import * as THREE from 'three'
import { Curves } from "three/examples/jsm/curves/CurveExtras"

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const starfieldParameters = messageEvent.data.parameters.matters.starfield
  const starfieldsAttributes = {}

  for (let clusterToPopulate of clustersToPopulate) {
    const brightStarsRandomAttributes = _getAttributesInRandomPosition(starfieldParameters)
    const firstPassStarsRandomAttributes = _getAttributesInRandomPosition(starfieldParameters)
    const secondPassStarsRandomAttributes = _getAttributesInRandomPosition(starfieldParameters)
    const thirdPassStarsRandomAttributes = _getAttributesInRandomPosition(starfieldParameters)

    starfieldsAttributes[clusterToPopulate] = {
        brightStarsRandomAttributes,
        firstPassStarsRandomAttributes,
        secondPassStarsRandomAttributes,
        thirdPassStarsRandomAttributes
    }
  }

  self.postMessage(starfieldsAttributes)
}

function _getAttributesInRandomPosition (parameters) {
  const positions = []
  const colors = []

  // TODO - randmonly use curves
  //CinquefoilKnot
  //VivianiCurve
  //KnotCurve
  //HelixCurve
  //DecoratedTorusKnot5c
  const CurvesGrannyKnot = new Curves.CinquefoilKnot()
  const geometry = new THREE.TubeGeometry(CurvesGrannyKnot, 3000, 12, 2, true);
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
        Math.random() > 0.4 ? "#eeefff" : parameters.colors[Math.floor(_getRandomNumberBeetwen(0, parameters.colors.length))]
    )
    colors.push(color.r, color.g, color.b)
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  }
}

function _getRandomNumberBeetwen (min, max) {
  return Math.random() * (max - min) + min
}
