import * as THREE from 'three'
import { gsap } from 'gsap'

export default class Epiphany {
  constructor (scene, library, parameters, camera, sequencer) {
    this.scene = scene
    this.library = library
    this.parameters = parameters
    this.camera = camera
    this.sequencer = sequencer
  }

  generate () {
    this.epiphanyGeometry = this._getEpiphanyGeometry(
        this._getEpiphanyAttributesInRandomPosition(
            300000,
            45000,
            this.parameters.matters[0].galaxy,
            window.currentUniverse
        )
    )
    this.epiphanyMaterial = this._getEpiphanyMaterial(this.library.textures.universe.universe[0])
    this.epiphany = new THREE.Points(this.epiphanyGeometry, this.epiphanyMaterial)

    this.epiphanySourceGeometry = new THREE.PlaneGeometry(1000000, 1000000)
    this.epiphanySourceMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF, side: THREE.DoubleSide})
    this.epiphanySourceMesh = new THREE.Mesh(this.epiphanySourceGeometry, this.epiphanySourceMaterial)

    this.epiphanySourceMesh.rotation.y = -150
    this.scene.add(this.epiphany, this.epiphanySourceMesh)

    window.epiphany = this
  }

  _getEpiphanyAttributesInRandomPosition (max, clusterSize, parameters) {
    const chosenColors = this._getTwoDifferentColors(parameters.galaxyColors)
    const positions = []
    const colors = []
    const radius = clusterSize * 10
    const mixedColor = chosenColors.colorIn.clone()

    for (let i = 0; i < max; i++) {
        const i3 = i * 3
        const randomRadiusPosition = Math.random() * radius + Math.random()

        const x = Math.pow(
        Math.random(),
        parameters.spiral.randomnessPower
        ) * parameters.spiral.randomness * randomRadiusPosition

        const y = Math.pow(
        Math.random(),
        parameters.spiral.randomnessPower
        ) * (Math.random() < 0.5 ? 1 : -1) * parameters.spiral.randomness * randomRadiusPosition

        const z = Math.pow(
        Math.random(),
        parameters.spiral.randomnessPower
        ) * (Math.random() < 0.5 ? 1 : -1) * parameters.spiral.randomness * randomRadiusPosition

        positions[i3] = randomRadiusPosition + x
        positions[i3 + 1] = y
        positions[i3 + 2] = randomRadiusPosition + z

        mixedColor.lerpColors(
        chosenColors.colorIn,
        chosenColors.colorOut,
        (randomRadiusPosition / radius) + parameters.spiral.colorInterpolationAmplitude
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

  _getTwoDifferentColors (pool) {
    const colorIn = new THREE.Color(pool.in[THREE.MathUtils.randInt(0, pool.in.length - 1)])
    const colorOut = new THREE.Color(pool.out[THREE.MathUtils.randInt(0, pool.out.length - 1)])
  
    return { colorIn, colorOut }
  }

  _getEpiphanyGeometry (randomAttributes) {
    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(randomAttributes.positions, 3)
    )

    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(randomAttributes.colors, 3)
    )

    return geometry
  }

  _getEpiphanyMaterial (texture) {
    texture.magFilter = THREE.NearestFilter

    const material = new THREE.PointsMaterial({
      size: 200,
      opacity: 1,
      map: texture,
      sizeAttenuation: true,
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: false
    })

    return material
  }

  async animate () {
    this.epiphanyTimeline = gsap.timeline()

    // initial position
    this.camera.position.x = 41933.344083521246
    this.camera.position.y = 2601.9473229586356
    this.camera.position.z = -41610.88345738852
    this.camera.rotation.x = -1.5819946141795853
    this.camera.rotation.y = -0.01142823229729023
    this.camera.rotation.z = -2.3460639896805997

    // first step, moving to epiphany
    this.epiphanyTimeline
      .to(this.camera.position, { duration: 70, x: 5073.649103134025 }, 0)
      .to(this.camera.position, { duration: 70, y: 2601.9473229586356 }, 0)
      .to(this.camera.position, { duration: 70, z: 3463.0872659983047 }, 0)
      .to(this.camera.rotation, { duration: 70, x: -2.152754981377802 }, 0)
      .to(this.camera.rotation, { duration: 70, y: 0.4933583002859766 }, 0)
      .to(this.camera.rotation, { duration: 70, z: 2.517722836064396 }, 0)

    // second step, diving to epiphany
    this.epiphanyTimeline
      .to(this.camera.position, { duration: 70, x: 43502.35769250616 }, 65)
      .to(this.camera.position, { duration: 70, y: 2601.9461793450773 }, 65)
      .to(this.camera.position, { duration: 70, z: 40744.89427643778 }, 65)
      .to(this.camera.rotation, { duration: 70, x: 3.0245027035506347 }, 65)
      .to(this.camera.rotation, { duration: 70, y: -0.8722113376562891 }, 65)
      .to(this.camera.rotation, { duration: 70, z: 3.0517609576969265 }, 65)

    // final step, across the multiverse
    this.epiphanyTimeline
      .to(this.camera.position, { duration: 600, x: 593635.3548790453 }, 120)
      .to(this.camera.position, { duration: 600, y: 2601.946179 }, 120)
      .to(this.camera.position, { duration: 600, z: 495067.01445157954 }, 120)

    // parallel story telling
    this.sequencer.fadeOutById('#blackwall', 10, 'Power0.easeNone')
    await this.sequencer.fadeOutById('#whitewall', 10, 'Power0.easeNone')
    await this.sequencer.showThenHideStory(this.parameters.story.epiphany[0])
    await this.sequencer.showThenHideStory(this.parameters.story.epiphany[1], 0)
    await this.sequencer.showThenHideStory(this.parameters.story.epiphany[2], 0)
    await this.sequencer.showThenHideStory(this.parameters.story.epiphany[3], 0)
    await this.sequencer.showThenHideStory(this.parameters.story.epiphany[4], 0)
    await this.sequencer.showThenHideStory(this.parameters.story.epiphany[5], 0)
    await this.sequencer.showThenHideStory(this.parameters.story.epiphany[6], 0)
    await this.sequencer.showThenHideStory(this.parameters.story.epiphany[7], 0)
    await this.sequencer.showThenHideStory(this.parameters.story.epiphany[8], 0)
    await this.sequencer.showThenHideStory(this.parameters.story.epiphany[9], 0)
    await this.sequencer.asyncWaitFor(5000)
    await this.sequencer.fadeInById('#credits', 2, 'Power0.easeNone')

    window.controls.pointerLockControls.unlock()
  }

  dispose () {
    this.epiphanyGeometry.dispose()
    this.epiphanyMaterial.dispose()

    this.epiphanySourceGeometry.dispose()
    this.epiphanySourceMaterial.dispose()

    this.scene.remove(this.epiphany, this.epiphanySourceMesh)

    this.epiphany = null
    this.epiphanySourceMesh = null
    window.epiphany = null
  }
}
