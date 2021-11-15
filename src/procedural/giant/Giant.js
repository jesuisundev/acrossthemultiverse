import * as THREE from 'three'
import { gsap } from 'gsap'

import giantWhiteDwarfVertexShader from '../../shaders/giant/whitedwarf/vertex.glsl'
import giantWhiteDwarfFragmentShader from '../../shaders/giant/whitedwarf/fragment.glsl'
import giantStarVertexShader from '../../shaders/giant/star/vertex.glsl'
import giantStarFragmentShader from '../../shaders/giant/star/fragment.glsl'
import giantSunVertexShader from '../../shaders/giant/sun/vertex.glsl'
import giantSunFragmentShader from '../../shaders/giant/sun/fragment.glsl'

export default class Giant {
  constructor (scene, library, parameters) {
    this.scene = scene
    this.library = library
    this.parameters = parameters

    this.textureSeen = []
    this.giant = null
  }

  generate (giantsAttributes, position, subtype = null) {
    switch (subtype) {
      case 'WhiteDwarf':
        return this._generateWhiteDwarf(giantsAttributes, position)

      case 'Star':
        return this._generateStar(giantsAttributes, position)

      default:
        return this._generateSun(giantsAttributes, position)
    }
  }

  _generateWhiteDwarf (giantsAttributes, position) {
    const currentCoordinateVector = this._getCoordinateVectorByPosition(position)

    const giantStarGeometry = new THREE.SphereGeometry(1, 64, 32)
    const brightStarTexture = null
    const giantStarmaterial = this._getRandomWhiteDwarfShaderMaterial()

    window.materialsToUpdate[giantStarmaterial.uuid] = giantStarmaterial
    const giantStar = new THREE.Mesh(giantStarGeometry, giantStarmaterial)
    const giantStarScale = THREE.MathUtils.randInt(
      window.currentUniverse.matters.giant.shader.whitedwarf.scale.min,
      window.currentUniverse.matters.giant.shader.whitedwarf.scale.max
    )
    giantStar.scale.set(giantStarScale, giantStarScale, giantStarScale)
    giantStar.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)

    const firstPassStarsGeometry = this._getRandomStarsGeometry(giantsAttributes.firstPassStarsRandomAttributes)
    const firstPassStarsTexture = this._getRandomStarsTexture()
    const firstPassStarsmaterial = this._getRandomStarsMaterial(firstPassStarsTexture)
    const firstPassStars = new THREE.Points(firstPassStarsGeometry, firstPassStarsmaterial)

    firstPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
    firstPassStarsGeometry.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
    firstPassStarsGeometry.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

    const randomGiant = {
      giant: {
        geometry: giantStarGeometry,
        texture: brightStarTexture,
        material: giantStarmaterial,
        mesh: giantStar
      },
      firstPass: {
        geometry: firstPassStarsGeometry,
        texture: firstPassStarsTexture,
        material: firstPassStarsmaterial,
        points: firstPassStars
      }
    }

    this.giant = randomGiant
  }

  _generateStar (giantsAttributes, position) {
    const currentCoordinateVector = this._getCoordinateVectorByPosition(position)

    const giantStarGeometry = new THREE.SphereGeometry(1, 64, 32)
    const brightStarTexture = null
    const giantStarmaterial = this._getRandomStarShaderMaterial()
    
    giantStarmaterial.userData.isStar = true

    window.materialsToUpdate[giantStarmaterial.uuid] = giantStarmaterial
    const giantStar = new THREE.Mesh(giantStarGeometry, giantStarmaterial)
    const giantStarScale = THREE.MathUtils.randInt(
      window.currentUniverse.matters.giant.shader.star.scale.min,
      window.currentUniverse.matters.giant.shader.star.scale.max
    )
    giantStar.scale.set(giantStarScale, giantStarScale, giantStarScale)
    giantStar.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)

    const firstPassStarsGeometry = this._getRandomStarsGeometry(giantsAttributes.firstPassStarsRandomAttributes)
    const firstPassStarsTexture = this._getRandomStarsTexture()
    const firstPassStarsmaterial = this._getRandomStarsMaterial(firstPassStarsTexture)
    const firstPassStars = new THREE.Points(firstPassStarsGeometry, firstPassStarsmaterial)

    firstPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
    firstPassStarsGeometry.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
    firstPassStarsGeometry.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

    const randomGiant = {
      giant: {
        geometry: giantStarGeometry,
        texture: brightStarTexture,
        material: giantStarmaterial,
        mesh: giantStar
      },
      firstPass: {
        geometry: firstPassStarsGeometry,
        texture: firstPassStarsTexture,
        material: firstPassStarsmaterial,
        points: firstPassStars
      }
    }

    this.giant = randomGiant
  }

  _generateSun (giantsAttributes, position) {
    const currentCoordinateVector = this._getCoordinateVectorByPosition(position)

    const giantStarGeometry = new THREE.SphereGeometry(1, 64, 32)
    const brightStarTexture = null
    const giantStarmaterial = this._getRandomSunShaderMaterial()

    window.materialsToUpdate[giantStarmaterial.uuid] = giantStarmaterial
    const giantStar = new THREE.Mesh(giantStarGeometry, giantStarmaterial)
    const giantStarScale = THREE.MathUtils.randInt(
      window.currentUniverse.matters.giant.shader.sun.scale.min,
      window.currentUniverse.matters.giant.shader.sun.scale.max
    )
    giantStar.scale.set(giantStarScale, giantStarScale, giantStarScale)
    giantStar.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)

    const firstPassStarsGeometry = this._getRandomStarsGeometry(giantsAttributes.firstPassStarsRandomAttributes)
    const firstPassStarsTexture = this._getRandomStarsTexture()
    const firstPassStarsmaterial = this._getRandomStarsMaterial(firstPassStarsTexture)
    const firstPassStars = new THREE.Points(firstPassStarsGeometry, firstPassStarsmaterial)

    firstPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
    firstPassStarsGeometry.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
    firstPassStarsGeometry.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

    const randomGiant = {
      giant: {
        geometry: giantStarGeometry,
        texture: brightStarTexture,
        material: giantStarmaterial,
        mesh: giantStar
      },
      firstPass: {
        geometry: firstPassStarsGeometry,
        texture: firstPassStarsTexture,
        material: firstPassStarsmaterial,
        points: firstPassStars
      }
    }

    this.giant = randomGiant
  }

  dispose () {
    if (!this.giant) {
      console.log("Can't dispose empty giant")
      return
    }

    delete window.materialsToUpdate[this.giant.giant.material.uuid]

    this.giant.giant.geometry.dispose()
    this.giant.firstPass.geometry.dispose()

    this.giant.giant.material.dispose()
    this.giant.firstPass.material.dispose()

    this.scene.remove(
      this.giant.giant.mesh,
      this.giant.firstPass.points
    )

    this.giant = null
  }

  show () {
    if (!this.giant) {
      console.log("Can't show empty giant")
      return
    }

    this.scene.add(
      this.giant.giant.mesh,
      this.giant.firstPass.points
    )

    gsap.timeline()
      .to(this.giant.firstPass.points.material, { duration: 10, opacity: 1 }, 0)
  }

  _getRandomSunShaderMaterial () {
    return new THREE.ShaderMaterial({
      precision: 'lowp',
      vertexShader: giantSunVertexShader,
      fragmentShader: giantSunFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBrightnessAmplifier: {
          value: THREE.MathUtils.randFloat(
            window.currentUniverse.matters.giant.shader.sun.uBrightnessAmplifier.min,
            window.currentUniverse.matters.giant.shader.sun.uBrightnessAmplifier.max
          )
        },
        uNoiseIntensity: {
          value: THREE.MathUtils.randFloat(
            window.currentUniverse.matters.giant.shader.sun.uNoiseIntensity.min,
            window.currentUniverse.matters.giant.shader.sun.uNoiseIntensity.max
          )
        },
        uNoiseSpeed: {
          value: THREE.MathUtils.randFloat(
            window.currentUniverse.matters.giant.shader.sun.uNoiseSpeed.min,
            window.currentUniverse.matters.giant.shader.sun.uNoiseSpeed.max
          )
        },
        uColorAmplifierPrimary: { 
          value: window.currentUniverse.matters.giant.shader.sun.uColorAmplifier.primary
        },
        uColorAmplifierSecondary: { 
          value: window.currentUniverse.matters.giant.shader.sun.uColorAmplifier.secondary
        },
        uColorAmplifierTertiary: { 
          value: window.currentUniverse.matters.giant.shader.sun.uColorAmplifier.tertiary
        },
        fogColor: { value: this.scene.fog.color },
        fogNear: { value: this.scene.fog.near },
        fogFar: { value: this.scene.fog.far }
      },
      side: THREE.FrontSide,
      fog: true
    })
  }

  _getRandomStarShaderMaterial () {
    const colors = window.currentUniverse.matters.giant.shader.star.colors
    const currentColors = Object.create(colors[THREE.MathUtils.randInt(0, colors.length - 1)])

    return new THREE.ShaderMaterial({
      precision: 'lowp',
      vertexShader: giantStarVertexShader,
      fragmentShader: giantStarFragmentShader,
      uniforms: {
        sphere_radius: { value: 1 },
        sphere_position: { value: new THREE.Vector3(0, 0, 0) },
        uTime: { value: 0 },
        time_multiplier: { value: 0.0010 },
        color_step_1: { value: new THREE.Color(currentColors[0]) },
        color_step_2: { value: new THREE.Color(currentColors[1]) },
        color_step_3: { value: new THREE.Color(currentColors[2]) },
        color_step_4: { value: new THREE.Color(currentColors[3]) },
        ratio_step_1: { value: 0.2 },
        ratio_step_2: { value: 0.4 },
        displacement: { value: 0.0 },
        fogColor: { value: this.scene.fog.color },
        fogNear: { value: this.scene.fog.near },
        fogFar: { value: this.scene.fog.far }
      },
      side: THREE.FrontSide,
      fog: true
    })
  }

  _getRandomWhiteDwarfShaderMaterial () {
    return new THREE.ShaderMaterial({
      precision: 'lowp',
      vertexShader: giantWhiteDwarfVertexShader,
      fragmentShader: giantWhiteDwarfFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBrightnessAmplifier: {
          value: THREE.MathUtils.randFloat(
            window.currentUniverse.matters.giant.shader.whitedwarf.uBrightnessAmplifier.min,
            window.currentUniverse.matters.giant.shader.whitedwarf.uBrightnessAmplifier.max
          )
        },
        uNoiseIntensity: {
          value: THREE.MathUtils.randFloat(
            window.currentUniverse.matters.giant.shader.whitedwarf.uNoiseIntensity.min,
            window.currentUniverse.matters.giant.shader.whitedwarf.uNoiseIntensity.max
          )
        },
        uNoiseSpeed: {
          value: THREE.MathUtils.randFloat(
            window.currentUniverse.matters.giant.shader.whitedwarf.uNoiseSpeed.min,
            window.currentUniverse.matters.giant.shader.whitedwarf.uNoiseSpeed.max
          )
        },
        fogColor: { value: this.scene.fog.color },
        fogNear: { value: this.scene.fog.near },
        fogFar: { value: this.scene.fog.far }
      },
      side: THREE.FrontSide,
      fog: true
    })
  }

  _getCoordinateVectorByPosition (position) {
    const coordinateVector = new THREE.Vector3(0, 0, 0)

    // we dont need to tweak coordinates on the origin cluster
    if (position !== '0,0,0') {
      const arrayCurrentCluster = position.split(',')

      // handling x axis (right and left) clusters population
      const xCurrentCluster = parseInt(arrayCurrentCluster[0])

      if (xCurrentCluster !== 0) {
        coordinateVector.x = (this.parameters.grid.clusterSize) * xCurrentCluster
      }

      // since we're not handling vertical movement at the moment
      // we dont need to handle the y axis

      // handling z axis (forward and backward) clusters population
      const zCurrentCluster = parseInt(arrayCurrentCluster[2])

      if (zCurrentCluster !== 0) {
        coordinateVector.z = (this.parameters.grid.clusterSize) * zCurrentCluster
      }
    }

    return coordinateVector
  }

  /**
     * @param {*} max
     * @returns
     */
  _getRandomStarsGeometry (randomAttributes) {
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

  _getRandomStarsTexture (type = 'pass') {
    const currentTexturesPool = this.library.textures.starfield[type].filter(texture => !this.textureSeen.includes(texture))
    const randomTexture = currentTexturesPool[THREE.MathUtils.randInt(0, currentTexturesPool.length - 1)]

    this.textureSeen.push(randomTexture)

    return randomTexture
  }

  /**
     * @param {*} texture
     * @param {*} opacity
     * @param {*} size
     * @returns
     */
  _getRandomStarsMaterial (randomMaterialTexture, enforcedSize, enforcedOpacity) {
    const randomMaterialSize = enforcedSize || enforcedSize === 0 ? enforcedSize : THREE.MathUtils.randInt(window.currentUniverse.matters.giant.material.size.pass.min, window.currentUniverse.matters.giant.material.size.pass.max)
    const randomMaterialOpacity = enforcedOpacity || enforcedOpacity === 0 ? enforcedOpacity : THREE.MathUtils.randInt(window.currentUniverse.matters.giant.material.opacity.pass.min, window.currentUniverse.matters.giant.material.opacity.pass.max)

    randomMaterialTexture.magFilter = THREE.NearestFilter

    const material = new THREE.PointsMaterial({
      size: randomMaterialSize,
      opacity: randomMaterialOpacity,
      map: randomMaterialTexture,
      sizeAttenuation: true,
      depthWrite: false,
      transparent: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      opacity: 0
    })

    return material
  }
}
