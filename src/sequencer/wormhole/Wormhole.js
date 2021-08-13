import * as THREE from 'three'
import { Curves } from 'three/examples/jsm/curves/CurveExtras'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils.js'

export default class Wormhole {
  constructor (scene, library, parameters) {
    this.scene = scene
    this.library = library
    this.parameters = parameters
  }

  generate () {
    window.wormhole.shape = new Curves.TorusKnot()
    window.wormhole.shape.scale = 500

    const wireframedStarsSpeederTexture = this.library.textures.wormhole.galaxy[0]
    wireframedStarsSpeederTexture.wrapS = THREE.RepeatWrapping
    wireframedStarsSpeederTexture.wrapT = THREE.MirroredRepeatWrapping
    wireframedStarsSpeederTexture.repeat.set(40, 2)
    const wireframedStarsSpeederMaterial = new THREE.MeshBasicMaterial({
      map: wireframedStarsSpeederTexture,
      transparent: true,
      opacity: this.parameters.wormhole.wireframedStarsSpeeder.material.opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      wireframe: true
    })

    const auraSpeederTexture = this.library.textures.wormhole.galaxy[1]
    auraSpeederTexture.wrapS = THREE.RepeatWrapping
    auraSpeederTexture.wrapT = THREE.MirroredRepeatWrapping
    auraSpeederTexture.repeat.set(1, 2)
    const auraSpeederMaterial = new THREE.MeshBasicMaterial({
      map: auraSpeederTexture,
      transparent: true,
      opacity: this.parameters.wormhole.auraSpeeder.material.opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    const nebulaSpeederTexture = this.library.textures.wormhole.galaxy[2]
    nebulaSpeederTexture.wrapS = THREE.RepeatWrapping
    nebulaSpeederTexture.wrapT = THREE.MirroredRepeatWrapping
    nebulaSpeederTexture.repeat.set(1, 2)
    const nebulaSpeederMaterial = new THREE.MeshBasicMaterial({
      map: nebulaSpeederTexture,
      transparent: true,
      opacity: this.parameters.wormhole.nebulaSpeeder.material.opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })

    const starsSpeederTexture = this.library.textures.wormhole.galaxy[3]
    starsSpeederTexture.wrapS = THREE.RepeatWrapping
    starsSpeederTexture.wrapT = THREE.MirroredRepeatWrapping
    starsSpeederTexture.repeat.set(10, 2)
    const starsSpeederMaterial = new THREE.MeshBasicMaterial({
      map: starsSpeederTexture,
      transparent: true,
      opacity: this.parameters.wormhole.starsSpeeder.material.opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })

    const wormholeGeometry = new THREE.TubeGeometry(window.wormhole.shape, 500, 12, 12, true)
    const wormholeTubeMesh = SceneUtils.createMultiMaterialObject(wormholeGeometry, [
      wireframedStarsSpeederMaterial,
      auraSpeederMaterial,
      nebulaSpeederMaterial,
      starsSpeederMaterial
    ])

    this.scene.add(wormholeTubeMesh)
  }

  active () {
    window.wormhole.active = true
  }

  dispose () {
    window.wormhole.active = false
  }
}
