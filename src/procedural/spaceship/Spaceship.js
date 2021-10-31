import * as THREE from 'three'
import { gsap } from 'gsap'

export default class Spaceship {
  constructor (scene, library, parameters) {
    this.scene = scene
    this.library = library
    this.parameters = parameters

    this.textureSeen = []
    this.spaceship = null
  }

  generate (spaceshipAttributes, position, subtype = null) {
    const currentCoordinateVector = this._getCoordinateVectorByPosition(position)

    const brightStarsGeometry = this._getRandomStarsGeometry(spaceshipAttributes.brightStarsRandomAttributes)
    const brightStarTexture = this._getRandomStarsTexture('bright')
    const brightStarsmaterial = this._getRandomStarsMaterial(brightStarTexture, THREE.MathUtils.randInt(
      this.parameters.matters[window.currentUniverse].spaceship.material.size.bright.min,
      this.parameters.matters[window.currentUniverse].spaceship.material.size.bright.max
    ))
    const brightStars = new THREE.Points(brightStarsGeometry, brightStarsmaterial)

    brightStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
    brightStars.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
    brightStars.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

    const firstPassStarsGeometry = this._getRandomStarsGeometry(spaceshipAttributes.firstPassStarsRandomAttributes)
    const firstPassStarsTexture = this._getRandomStarsTexture()
    const firstPassStarsmaterial = this._getRandomStarsMaterial(firstPassStarsTexture)
    const firstPassStars = new THREE.Points(firstPassStarsGeometry, firstPassStarsmaterial)

    firstPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
    firstPassStarsGeometry.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
    firstPassStarsGeometry.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

    const secondPassStarsGeometry = this._getRandomStarsGeometry(spaceshipAttributes.secondPassStarsRandomAttributes)
    const secondPassStarsTexture = this._getRandomStarsTexture()
    const secondPassStarsmaterial = this._getRandomStarsMaterial(secondPassStarsTexture)
    const secondPassStars = new THREE.Points(secondPassStarsGeometry, secondPassStarsmaterial)

    secondPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
    secondPassStars.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
    secondPassStars.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

    const thirdPassStarsGeometry = this._getRandomStarsGeometry(spaceshipAttributes.thirdPassStarsRandomAttributes)
    const thirdPassStarsTexture = this._getRandomStarsTexture()
    const thirdPassStarsmaterial = this._getRandomStarsMaterial(thirdPassStarsTexture)
    const thirdPassStars = new THREE.Points(thirdPassStarsGeometry, thirdPassStarsmaterial)

    thirdPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
    thirdPassStars.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
    thirdPassStars.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

    const spaceship = this._getSpaceship(subtype)

    if(spaceship) {
      spaceship.children[0].material.opacity = 0
      spaceship.children[1].material.opacity = 0
      spaceship.position.set(
        currentCoordinateVector.x > 0 ? currentCoordinateVector.x - this.parameters.grid.clusterSize / 3 : currentCoordinateVector.x + this.parameters.grid.clusterSize / 3,
        currentCoordinateVector.y,
        currentCoordinateVector.z > 0 ? currentCoordinateVector.z - this.parameters.grid.clusterSize / 3 : currentCoordinateVector.z + this.parameters.grid.clusterSize / 3
      )
      spaceship.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
      spaceship.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
      window.spaceshipToUpdate[spaceship.uuid] = spaceship
    }
    console.log(spaceship)
    

    const randomSpaceship = {
      bright: {
        geometry: brightStarsGeometry,
        texture: brightStarTexture,
        material: brightStarsmaterial,
        points: brightStars
      },
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
      },
      spaceship: {
        mesh: spaceship
      }
    }

    this.spaceship = randomSpaceship
  }

  dispose () {
    if (!this.spaceship) {
      console.log('Can\'t dispose empty Spaceship')
      return
    }

    this.spaceship.bright.geometry.dispose()
    this.spaceship.firstPass.geometry.dispose()
    this.spaceship.secondPass.geometry.dispose()
    this.spaceship.thirdPass.geometry.dispose()

    this.spaceship.bright.material.dispose()
    this.spaceship.firstPass.material.dispose()
    this.spaceship.secondPass.material.dispose()
    this.spaceship.thirdPass.material.dispose()

    delete window.spaceshipToUpdate[this.spaceship.spaceship.mesh.uuid]

    this.scene.remove(
      this.spaceship.bright.points,
      this.spaceship.firstPass.points,
      this.spaceship.secondPass.points,
      this.spaceship.thirdPass.points,
      this.spaceship.spaceship.mesh
    )

    this.spaceship = null
  }

  show () {
    if (!this.spaceship) {
      console.log('Can\'t show empty Spaceship')
      return
    }

    this.scene.add(
      this.spaceship.bright.points,
      this.spaceship.firstPass.points,
      this.spaceship.secondPass.points,
      this.spaceship.thirdPass.points,
      this.spaceship.spaceship.mesh
    )

    gsap.timeline()
      .to(this.spaceship.bright.points.material, { duration: 3, opacity: 1 }, 0)
      .to(this.spaceship.firstPass.points.material, { duration: 3, opacity: 1 }, 0)
      .to(this.spaceship.secondPass.points.material, { duration: 3, opacity: 1 }, 0)
      .to(this.spaceship.thirdPass.points.material, { duration: 3, opacity: 1 }, 0)
      .to(this.spaceship.spaceship.mesh.children[0].material, { duration: 3, opacity: 1 }, 0)
      .to(this.spaceship.spaceship.mesh.children[1].material, { duration: 3, opacity: 1 }, 0)
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
    const randomMaterialSize = enforcedSize || enforcedSize === 0 ? enforcedSize : THREE.MathUtils.randInt(this.parameters.matters[window.currentUniverse].spaceship.material.size.pass.min, this.parameters.matters[window.currentUniverse].spaceship.material.size.pass.max)
    const randomMaterialOpacity = enforcedOpacity || enforcedOpacity === 0 ? enforcedOpacity : THREE.MathUtils.randInt(this.parameters.matters[window.currentUniverse].spaceship.material.opacity.pass.min, this.parameters.matters[window.currentUniverse].spaceship.material.opacity.pass.max)

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

  _getSpaceship(subtype) {
    switch (subtype) {
      case 'normandy':
        return this.library.normandy.model ? this.library.normandy.model.clone() : null
      default:
        console.error('Cannot find spaceship subtype')
        return null
    }
  }
}
