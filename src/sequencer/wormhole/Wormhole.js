import * as THREE from 'three'
import { Curves } from 'three/examples/jsm/curves/CurveExtras'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils.js'
import { gsap } from 'gsap'

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
    this.wireframedStarsSpeederMaterial = wireframedStarsSpeederMaterial

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
    this.auraSpeederMaterial = auraSpeederMaterial

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
    this.nebulaSpeederMaterial = nebulaSpeederMaterial

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
    this.starsSpeederMaterial = starsSpeederMaterial

    const wormholeGeometry = new THREE.TubeGeometry(window.wormhole.shape, 500, 12, 12, true)
    const wormholeTubeMesh = SceneUtils.createMultiMaterialObject(wormholeGeometry, [
      wireframedStarsSpeederMaterial,
      auraSpeederMaterial,
      nebulaSpeederMaterial,
      starsSpeederMaterial
    ])

    this.scene.add(wormholeTubeMesh)
  }

  async animate () {
    const wormholeTimeline = gsap.timeline()

    // initial massive boost at wormhole enter
    wormholeTimeline
      .to(this.starsSpeederMaterial, { duration: 12, ease: 'expo.out', opacity: 1 }, 0)
      .to(this.auraSpeederMaterial, { duration: 12, ease: 'expo.out', opacity: 0.8 }, 0)
      .to(window.wormhole, { duration: 12, ease: 'expo.out', speed: 2000 }, 0)

    return wormholeTimeline.then(() => true)
  }

  active () {
    window.wormhole.active = true
  }

  dispose () {
    window.wormhole.active = false
    // todo - delete properly for garbage collector
  }
}
