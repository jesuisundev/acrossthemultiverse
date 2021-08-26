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
    const curveShape = 500
    const random = Math.random()

    if (random < 0.33) {
      window.wormhole.shape = new Curves.TorusKnot(curveShape)
    } else if (random < 0.66) {
      window.wormhole.shape = new Curves.CinquefoilKnot(curveShape)
    } else {
      window.wormhole.shape = new Curves.TrefoilKnot(curveShape)
    }

    this.library.textures.wormhole.galaxy[0].wrapS = THREE.RepeatWrapping
    this.library.textures.wormhole.galaxy[0].wrapT = THREE.MirroredRepeatWrapping
    this.library.textures.wormhole.galaxy[0].repeat.set(40, 2)

    this.wireframedStarsSpeederMaterial = new THREE.MeshBasicMaterial({
      map: this.library.textures.wormhole.galaxy[0],
      transparent: false,
      opacity: this.parameters.wormhole.wireframedStarsSpeeder.material.opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      wireframe: true
    })

    this.library.textures.wormhole.galaxy[1].wrapS = THREE.RepeatWrapping
    this.library.textures.wormhole.galaxy[1].wrapT = THREE.MirroredRepeatWrapping
    this.library.textures.wormhole.galaxy[1].repeat.set(1, 2)

    this.auraSpeederMaterial = new THREE.MeshBasicMaterial({
      map: this.library.textures.wormhole.galaxy[1],
      transparent: false,
      opacity: this.parameters.wormhole.auraSpeeder.material.opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    this.library.textures.wormhole.galaxy[2].wrapS = THREE.RepeatWrapping
    this.library.textures.wormhole.galaxy[2].wrapT = THREE.MirroredRepeatWrapping
    this.library.textures.wormhole.galaxy[2].repeat.set(20, 2)

    this.nebulaSpeederMaterial = new THREE.MeshBasicMaterial({
      map: this.library.textures.wormhole.galaxy[2],
      transparent: false,
      opacity: this.parameters.wormhole.nebulaSpeeder.material.opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })

    this.library.textures.wormhole.galaxy[3].wrapS = THREE.RepeatWrapping
    this.library.textures.wormhole.galaxy[3].wrapT = THREE.MirroredRepeatWrapping
    this.library.textures.wormhole.galaxy[3].repeat.set(10, 2)

    this.starsSpeederMaterial = new THREE.MeshBasicMaterial({
      map: this.library.textures.wormhole.galaxy[3],
      transparent: false,
      opacity: this.parameters.wormhole.starsSpeeder.material.opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })

    this.library.textures.wormhole.galaxy[4].wrapS = THREE.RepeatWrapping
    this.library.textures.wormhole.galaxy[4].wrapT = THREE.MirroredRepeatWrapping
    this.library.textures.wormhole.galaxy[4].repeat.set(20, 2)

    this.clusterSpeederMaterial = new THREE.MeshBasicMaterial({
      map: this.library.textures.wormhole.galaxy[4],
      transparent: false,
      opacity: this.parameters.wormhole.clusterSpeeder.material.opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })

    this.wormholeGeometry = new THREE.TubeGeometry(window.wormhole.shape, 800, 5, 12, true)
    this.wormholeTubeMesh = SceneUtils.createMultiMaterialObject(this.wormholeGeometry, [
      this.wireframedStarsSpeederMaterial,
      this.auraSpeederMaterial,
      this.nebulaSpeederMaterial,
      this.starsSpeederMaterial,
      this.clusterSpeederMaterial
    ])

    this.scene.add(this.wormholeTubeMesh)
  }

  async animate () {
    this.wormholeTimeline = gsap.timeline()

    // initial massive boost at wormhole enter
    this.wormholeTimeline
      .to(this.starsSpeederMaterial, { duration: 7, opacity: 1 }, 0)
      .to(this.wireframedStarsSpeederMaterial, { duration: 7, ease: 'expo.out', opacity: 1 }, 0)
      .to(this.auraSpeederMaterial, { duration: 7, ease: 'expo.out', opacity: 1 }, 0)
      .to(window.wormhole, { duration: 7, ease: 'expo.out', speed: 2500 }, 0)

    // adding speed and noises
    this.wormholeTimeline
      .to(this.clusterSpeederMaterial, { duration: 6, opacity: 1 }, 7)
      .to(this.auraSpeederMaterial, { duration: 2, opacity: 0 }, 7)
      .to(window.wormhole, { duration: 6, speed: 2000 }, 7)

    // adding speed and nebula distorded
    this.wormholeTimeline
      .to(this.nebulaSpeederMaterial, { duration: 6, opacity: 1 }, 13)
      .to(this.clusterSpeederMaterial, { duration: 6, opacity: 0 }, 13)
      .to(this.auraSpeederMaterial, { duration: 6, opacity: 0.7 }, 13)
      .to(window.wormhole, { duration: 6, speed: 1800 }, 13)

    return this.wormholeTimeline.then(() => true)
  }

  active () {
    window.wormhole.active = true
  }

  dispose () {
    window.wormhole.active = false

    this.wormholeGeometry.dispose()

    this.wireframedStarsSpeederMaterial.dispose()
    this.auraSpeederMaterial.dispose()
    this.nebulaSpeederMaterial.dispose()
    this.starsSpeederMaterial.dispose()
    this.clusterSpeederMaterial.dispose()

    this.scene.remove(this.wormholeTubeMesh)

    this.wormholeTimeline = null
    this.wormholeTubeMesh = null
  }
}
