import * as THREE from 'three'

export default class Galaxy {
  constructor (scene, library, parameters) {
    this.scene = scene
    this.library = library
    this.parameters = parameters

    this.textureSeen = []
    this.galaxy = null
  }

  generate (galaxiesAttributes, position) {
    const currentCoordinateVector = this._getCoordinateVectorByPosition(position)

    const firstPassStarsGeometry = this._getRandomStarsGeometry(galaxiesAttributes.firstPassStarsRandomAttributes)
    const firstPassStarsTexture = this._getRandomStarsTexture()
    const firstPassStarsmaterial = this._getRandomStarsMaterial(firstPassStarsTexture)
    const firstPassStars = new THREE.Points(firstPassStarsGeometry, firstPassStarsmaterial)

    firstPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
    //firstPassStarsGeometry.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
    //firstPassStarsGeometry.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
    // TODO - boundary to random rotation
    firstPassStarsGeometry.rotateX(250)
    const randomGalaxy = {
      firstPass: {
        geometry: firstPassStarsGeometry,
        texture: firstPassStarsTexture,
        material: firstPassStarsmaterial,
        points: firstPassStars
      }
    }

    this.galaxy = randomGalaxy
  }

  dispose () {
    if (!this.galaxy) {
      console.log('Can\'t dispose empty galaxy')
      return
    }

    this.galaxy.firstPass.geometry.dispose()

    this.galaxy.firstPass.material.dispose()

    this.scene.remove(
      this.galaxy.firstPass.points
    )

    this.galaxy = null
  }

  show () {
    if (!this.galaxy) {
      console.log('Can\'t show empty galaxy')
      return
    }

    this.scene.add(
      this.galaxy.firstPass.points
    )
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
    const starsChoosenIndexes = [0, 1, 3, 4]
    const currentTexturesPool = this.library.textures.starfield[type].filter((texture, index) => starsChoosenIndexes.includes(index))
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
    const randomMaterialSize = enforcedSize || enforcedSize === 0 ? enforcedSize : THREE.MathUtils.randInt(this.parameters.matters.galaxy.material.size.pass.min, this.parameters.matters.galaxy.material.size.pass.max)
    const randomMaterialOpacity = enforcedOpacity || enforcedOpacity === 0 ? enforcedOpacity : THREE.MathUtils.randInt(this.parameters.matters.galaxy.material.opacity.pass.min, this.parameters.matters.galaxy.material.opacity.pass.max)

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
