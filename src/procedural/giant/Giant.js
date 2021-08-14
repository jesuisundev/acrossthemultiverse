import * as THREE from 'three'
import giantSunVertexShader from '../../shaders/giant/sun/vertex.glsl'
import giantSunFragmentShader from '../../shaders/giant/sun/fragment.glsl'
import giantWhiteDwarfVertexShader from '../../shaders/giant/whitedwarf/vertex.glsl'
import giantWhiteDwarfFragmentShader from '../../shaders/giant/whitedwarf/fragment.glsl'

export default class Giant {
  constructor (scene, library, parameters) {
    this.scene = scene
    this.library = library
    this.parameters = parameters

    this.textureSeen = []
    this.giant = null
  }

  generate (giantsAttributes, position, subtype = null) {
    if (subtype === 'whitedwarf') {
      return this._generateWhiteDwarf(giantsAttributes, position)
    }

    const currentCoordinateVector = this._getCoordinateVectorByPosition(position)

    const giantStarGeometry = new THREE.SphereGeometry(1, 64, 32)
    const brightStarTexture = null
    // TODO - fix transparency issue (add a mesh inside to cover up?)
    const giantStarmaterial = this._getRandomSunShaderMaterial()

    giantStarmaterial.key = Math.floor(Date.now() + Math.random())
    window.materialsToUpdate[giantStarmaterial.key] = giantStarmaterial
    const giantStar = new THREE.Mesh(giantStarGeometry, giantStarmaterial)
    const giantStarScale = THREE.MathUtils.randInt(
      this.parameters.matters.giant.shader.sun.scale.min,
      this.parameters.matters.giant.shader.sun.scale.max
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

  _generateWhiteDwarf (giantsAttributes, position) {
    const currentCoordinateVector = this._getCoordinateVectorByPosition(position)

    const giantStarGeometry = new THREE.SphereGeometry(1, 64, 32)
    const brightStarTexture = null
    // TODO - fix transparency issue (add a mesh inside to cover up?)
    const giantStarmaterial = this._getRandomWhiteDwarfShaderMaterial()

    giantStarmaterial.key = Math.floor(Date.now() + Math.random())
    window.materialsToUpdate[giantStarmaterial.key] = giantStarmaterial
    const giantStar = new THREE.Mesh(giantStarGeometry, giantStarmaterial)
    const giantStarScale = THREE.MathUtils.randInt(
      this.parameters.matters.giant.shader.whitedwarf.scale.min,
      this.parameters.matters.giant.shader.whitedwarf.scale.max
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
      console.log('Can\'t dispose empty giant')
      return
    }

    delete window.materialsToUpdate[this.giant.giant.material.key]

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
      console.log('Can\'t show empty giant')
      return
    }

    this.scene.add(
      this.giant.giant.mesh,
      this.giant.firstPass.points
    )
  }

  _getRandomSunShaderMaterial () {
    return new THREE.ShaderMaterial({
      vertexShader: giantSunVertexShader,
      fragmentShader: giantSunFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBrightnessAmplifier: {
          value: THREE.MathUtils.randFloat(
            this.parameters.matters.giant.shader.sun.uBrightnessAmplifier.min,
            this.parameters.matters.giant.shader.sun.uBrightnessAmplifier.max
          )
        },
        uNoiseIntensity: {
          value: THREE.MathUtils.randFloat(
            this.parameters.matters.giant.shader.sun.uNoiseIntensity.min,
            this.parameters.matters.giant.shader.sun.uNoiseIntensity.max
          )
        },
        uNoiseSpeed: {
          value: THREE.MathUtils.randFloat(
            this.parameters.matters.giant.shader.sun.uNoiseSpeed.min,
            this.parameters.matters.giant.shader.sun.uNoiseSpeed.max
          )
        }
      },
      side: THREE.DoubleSide
    })
  }

  _getRandomWhiteDwarfShaderMaterial () {
    return new THREE.ShaderMaterial({
      vertexShader: giantWhiteDwarfVertexShader,
      fragmentShader: giantWhiteDwarfFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBrightnessAmplifier: {
          value: THREE.MathUtils.randFloat(
            this.parameters.matters.giant.shader.whitedwarf.uBrightnessAmplifier.min,
            this.parameters.matters.giant.shader.whitedwarf.uBrightnessAmplifier.max
          )
        },
        uNoiseIntensity: {
          value: THREE.MathUtils.randFloat(
            this.parameters.matters.giant.shader.whitedwarf.uNoiseIntensity.min,
            this.parameters.matters.giant.shader.whitedwarf.uNoiseIntensity.max
          )
        },
        uNoiseSpeed: {
          value: THREE.MathUtils.randFloat(
            this.parameters.matters.giant.shader.whitedwarf.uNoiseSpeed.min,
            this.parameters.matters.giant.shader.whitedwarf.uNoiseSpeed.max
          )
        }
      },
      side: THREE.DoubleSide
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
    const randomMaterialSize = enforcedSize || enforcedSize === 0 ? enforcedSize : THREE.MathUtils.randInt(this.parameters.matters.giant.material.size.pass.min, this.parameters.matters.giant.material.size.pass.max)
    const randomMaterialOpacity = enforcedOpacity || enforcedOpacity === 0 ? enforcedOpacity : THREE.MathUtils.randInt(this.parameters.matters.giant.material.opacity.pass.min, this.parameters.matters.giant.material.opacity.pass.max)

    randomMaterialTexture.magFilter = THREE.NearestFilter

    const material = new THREE.PointsMaterial({
      size: randomMaterialSize,
      opacity: randomMaterialOpacity,
      map: randomMaterialTexture,
      sizeAttenuation: true,
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    })

    return material
  }
}
