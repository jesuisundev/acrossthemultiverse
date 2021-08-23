import * as THREE from 'three'
import { gsap } from 'gsap'

export default class Epiphany {
  constructor (scene, library, parameters) {
    this.scene = scene
    this.library = library
    this.parameters = parameters
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

    this.library.textures.wormhole.galaxy[2].wrapS = THREE.RepeatWrapping
    this.library.textures.wormhole.galaxy[2].wrapT = THREE.MirroredRepeatWrapping

    this.epiphanyMaterial = this._getEpiphanyMaterial(this.library.textures.universe.universe[0])

    this.epiphany = new THREE.Points(this.epiphanyGeometry, this.epiphanyMaterial)

    this.scene.add(this.epiphany)
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

  _getEpiphanyMaterial (texture, enforcedSize, enforcedOpacity) {
    const randomMaterialSize = enforcedSize || enforcedSize === 0 ? enforcedSize : THREE.MathUtils.randInt(this.parameters.matters[window.currentUniverse].starfield.material.size.pass.min, this.parameters.matters[window.currentUniverse].starfield.material.size.pass.max)
    const randomMaterialOpacity = enforcedOpacity || enforcedOpacity === 0 ? enforcedOpacity : THREE.MathUtils.randInt(this.parameters.matters[window.currentUniverse].starfield.material.opacity.pass.min, this.parameters.matters[window.currentUniverse].starfield.material.opacity.pass.max)

    texture.magFilter = THREE.NearestFilter

    const material = new THREE.PointsMaterial({
      size: 200,
      opacity: randomMaterialOpacity,
      map: texture,
      sizeAttenuation: true,
      depthWrite: false,
      transparent: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false
    })

    return material
  }

  async animate () {
  }

  active () {
    window.epiphany.active = true
  }

  dispose () {
    window.epiphany.active = false

    this.epiphanyGeometry.dispose()
    this.epiphanyMaterial.dispose()

    this.scene.remove(this.epiphany)

    this.epiphany = null
  }
}
