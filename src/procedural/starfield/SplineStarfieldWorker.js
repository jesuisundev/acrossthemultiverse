// this is just not working the way i want it to
// might try to make it work later
// or can you ?

import * as THREE from 'three'
import { Curves } from "three/examples/jsm/curves/CurveExtras"

self.onmessage = messageEvent => {
  const clustersToPopulate = messageEvent.data.clustersToPopulate
  const starfieldParameters = messageEvent.data.parameters.matters.starfield
  const clusterSize = messageEvent.data.parameters.grid.clusterSize
  const starfieldsAttributes = {}

  for (let clusterToPopulate of clustersToPopulate) {
    const brightStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        starfieldParameters.budget * THREE.MathUtils.randFloat(
          starfieldParameters.vertices.bright.min,
          starfieldParameters.vertices.bright.max
        )
      ),
      clusterToPopulate,
      clusterSize,
      starfieldParameters
    )

    const firstPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        starfieldParameters.budget * THREE.MathUtils.randFloat(
          starfieldParameters.vertices.pass.min,
          starfieldParameters.vertices.pass.max
        )
      ),
      clusterToPopulate,
      clusterSize,
      starfieldParameters
    )

    const secondPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        starfieldParameters.budget * THREE.MathUtils.randFloat(
          starfieldParameters.vertices.pass.min,
          starfieldParameters.vertices.pass.max
        )
      ),
      clusterToPopulate,
      clusterSize,
      starfieldParameters
    )

    const thirdPassStarsRandomAttributes = _getAttributesInRandomPosition(
      Math.floor(
        starfieldParameters.budget * THREE.MathUtils.randFloat(
          starfieldParameters.vertices.pass.min,
          starfieldParameters.vertices.pass.max
        )
      ),
      clusterToPopulate,
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

function _getAttributesInRandomPosition (max, currentCluster, clusterSize, parameters) {
  const positions = []
  const colors = []

  const CurvesGrannyKnot = new Curves.CinquefoilKnot()
  const geometry = new THREE.TubeGeometry(CurvesGrannyKnot, 1000, 12, 2, true);
  geometry.scale(100, 100, 100)

  if (currentCluster != '0,0,0') {
    let xTranslation = 0
    let zTranslation = 0
    const arrayCurrentCluster = currentCluster.split(',')

    const xCurrentCluster = parseInt(arrayCurrentCluster[0])
    if (xCurrentCluster != 0) {
      //xTranslation = Math.floor(clusterSize / 4) * xCurrentCluster
      xTranslation = clusterSize * xCurrentCluster - (clusterSize / 2)
    }

    const zCurrentCluster = parseInt(arrayCurrentCluster[2])
    if (zCurrentCluster != 0) {
      //zTranslation = Math.floor(clusterSize / 4) * zCurrentCluster
      zTranslation = clusterSize * zCurrentCluster - (clusterSize / 2)
    }

    //console.log('xTranslation', xTranslation)
    //console.log('zTranslation', zTranslation)

    geometry.translate(xTranslation, 0, zTranslation)
  }

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
