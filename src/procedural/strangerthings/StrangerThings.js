import * as THREE from 'three'
import { gsap } from 'gsap'

export default class StrangerThings {
  constructor (scene, library, parameters) {
    this.scene = scene
    this.library = library
    this.parameters = parameters
    this.currentCoordinateVector = null
    this.textureSeen = []
    this.galaxy = null
    this.subtype = null
  }

  generate (strangerThingsAttributes, position, subtype = null) {
    this.currentCoordinateVector = this._getCoordinateVectorByPosition(position)
    this.subtype = subtype

    const rotation = THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360))

    const firstPassStarsGeometry = this._getRandomStarsGeometry(strangerThingsAttributes.firstPassStarsRandomAttributes)
    const firstPassStarsTexture = this._getRandomStarsTexture()
    const firstPassStarsmaterial = this._getRandomStarsMaterial(firstPassStarsTexture, currentUniverse.universeModifiers.type.id === 'filaments' ? 300 : false)
    const firstPassStars = new THREE.Points(firstPassStarsGeometry, firstPassStarsmaterial)

    firstPassStars.position.set(this.currentCoordinateVector.x, this.currentCoordinateVector.y, this.currentCoordinateVector.z)
    firstPassStarsGeometry.rotateX(rotation)

    const secondPassStarsGeometry = this._getRandomStarsGeometry(strangerThingsAttributes.secondPassStarsRandomAttributes)
    const secondPassStarsTexture = this._getRandomStarsTextureByType('cloud')
    const secondPassStarsmaterial = this._getRandomStarsMaterial(secondPassStarsTexture, 800, 100)
    const secondPassStars = new THREE.Points(secondPassStarsGeometry, secondPassStarsmaterial)

    secondPassStars.position.set(this.currentCoordinateVector.x, this.currentCoordinateVector.y, this.currentCoordinateVector.z)
    secondPassStars.rotateX(rotation)

    const thirdPassStarsGeometry = this._getRandomStarsGeometry(strangerThingsAttributes.thirdPassStarsRandomAttributes)
    const thirdPassStarsTexture = this._getRandomStarsTexture()
    const thirdPassStarsmaterial = this._getRandomStarsMaterial(thirdPassStarsTexture)
    const thirdPassStars = new THREE.Points(thirdPassStarsGeometry, thirdPassStarsmaterial)
    thirdPassStars.rotateX(rotation)

    thirdPassStars.position.set(this.currentCoordinateVector.x, this.currentCoordinateVector.y, this.currentCoordinateVector.z)

    if(this.subtype === 'cyclic'){
      window.cyclicStrangerThingsToUpdate[firstPassStars.uuid] = firstPassStars
      window.cyclicStrangerThingsToUpdate[secondPassStars.uuid] = secondPassStars
      window.cyclicStrangerThingsToUpdate[thirdPassStars.uuid] = thirdPassStars
    }

    const randomGalaxy = {
      firstPass: {
        geometry: firstPassStarsGeometry,
        texture: firstPassStarsTexture,
        material: firstPassStarsmaterial,
        points: firstPassStars
      },
      secondPass: {
        geometry: secondPassStarsGeometry,
        texture: secondPassStarsTexture,
        material: secondPassStarsmaterial,
        points: secondPassStars
      },
      thirdPass: {
        geometry: thirdPassStarsGeometry,
        texture: thirdPassStarsTexture,
        material: thirdPassStarsmaterial,
        points: thirdPassStars
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
    this.galaxy.secondPass.geometry.dispose()
    this.galaxy.thirdPass.geometry.dispose()

    this.galaxy.firstPass.material.dispose()
    this.galaxy.secondPass.material.dispose()
    this.galaxy.thirdPass.material.dispose()

    if(window.cyclicStrangerThingsToUpdate[this.galaxy.firstPass.uuid]) {
      delete window.cyclicStrangerThingsToUpdate[this.galaxy.firstPass.uuid]
      delete window.cyclicStrangerThingsToUpdate[this.galaxy.secondPass.uuid]
      delete window.cyclicStrangerThingsToUpdate[this.galaxy.thirdPass.uuid]
    } 

    this.scene.remove(
      this.galaxy.firstPass.points,
      this.galaxy.secondPass.points,
      this.galaxy.thirdPass.points
    )

    this.galaxy = null
  }

  show () {
    if (!this.galaxy) {
      console.log('Can\'t show empty galaxy')
      return
    }

    this.scene.add(
      this.galaxy.firstPass.points,
      this.galaxy.secondPass.points,
      this.galaxy.thirdPass.points
    )

    let minCloudOpacity = window.currentUniverse.matters.galaxy.material.opacity.pass.min
    let maxCloudOpacity = window.currentUniverse.matters.galaxy.material.opacity.pass.max

    gsap.timeline()
      .to(this.galaxy.firstPass.points.material, { duration: 3, opacity: 1 }, 0)
      .to(this.galaxy.secondPass.points.material, {
        duration: 3,
        opacity: THREE.MathUtils.randFloat(minCloudOpacity, maxCloudOpacity)
      }, 0)
      .to(this.galaxy.thirdPass.points.material, { duration: 3, opacity: 1 }, 0)
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

  _getRandomStarsTexture () {
    const currentTexturesPool = this.library.textures.starfield["pass"]
    const randomTexture = currentTexturesPool[THREE.MathUtils.randInt(0, currentTexturesPool.length - 1)]

    this.textureSeen.push(randomTexture)

    return randomTexture
  }

  _getRandomStarsTextureByType (type = 'pass') {
    const currentTexturesPool = this.library.textures.nebula[type].filter(texture => !this.textureSeen.includes(texture))
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
    const randomMaterialSize = enforcedSize || enforcedSize === 0 ? enforcedSize : THREE.MathUtils.randInt(window.currentUniverse.matters.strangerthings[this.subtype].material.size.pass.min, window.currentUniverse.matters.strangerthings[this.subtype].material.size.pass.max)
    const randomMaterialOpacity = enforcedOpacity || enforcedOpacity === 0 ? enforcedOpacity : THREE.MathUtils.randInt(window.currentUniverse.matters.strangerthings[this.subtype].material.opacity.pass.min, window.currentUniverse.matters.strangerthings[this.subtype].material.opacity.pass.max)

    randomMaterialTexture.magFilter = THREE.NearestFilter

    const material = new THREE.PointsMaterial({
      size: randomMaterialSize,
      opacity: randomMaterialOpacity,
      map: randomMaterialTexture,
      sizeAttenuation: true,
      depthWrite: false,
      transparent: window.currentUniverse.matters.galaxy.material.transparent,
      blending: window.currentUniverse.matters.galaxy.material.blending,
      vertexColors: true,
      opacity: 0
    })

    return material
  }
}
