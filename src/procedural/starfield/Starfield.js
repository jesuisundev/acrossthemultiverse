import * as THREE from 'three'

export default class StarField {
    constructor(scene, library, parameters) {
        this.scene = scene
        this.library = library
        this.parameters = parameters

        this.textureSeen = []
        this.starfield = null
    }

    generate(starfieldsAttributes, position) {
        const currentCoordinateVector = this._getCoordinateVectorByPosition(position)

        const brightStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.brightStarsRandomAttributes)
        const brightStarTexture = this._getRandomStarsTexture('bright')
        const brightStarsmaterial = this._getRandomStarsMaterial(brightStarTexture, THREE.MathUtils.randInt(
            this.parameters.matters.starfield.material.size.bright.min,
            this.parameters.matters.starfield.material.size.bright.max
        ))
        const brightStars = new THREE.Points(brightStarsGeometry, brightStarsmaterial)

        brightStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
        brightStars.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
        brightStars.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

        const firstPassStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.firstPassStarsRandomAttributes)
        const firstPassStarsTexture = this._getRandomStarsTexture()
        const firstPassStarsmaterial = this._getRandomStarsMaterial(firstPassStarsTexture)
        const firstPassStars = new THREE.Points(firstPassStarsGeometry, firstPassStarsmaterial)

        firstPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
        firstPassStarsGeometry.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
        firstPassStarsGeometry.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

        const secondPassStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.secondPassStarsRandomAttributes)
        const secondPassStarsTexture = this._getRandomStarsTexture()
        const secondPassStarsmaterial = this._getRandomStarsMaterial(secondPassStarsTexture)
        const secondPassStars = new THREE.Points(secondPassStarsGeometry, secondPassStarsmaterial)

        secondPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
        secondPassStars.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
        secondPassStars.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

        const thirdPassStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.thirdPassStarsRandomAttributes)
        const thirdPassStarsTexture = this._getRandomStarsTexture()
        const thirdPassStarsmaterial = this._getRandomStarsMaterial(thirdPassStarsTexture)
        const thirdPassStars = new THREE.Points(thirdPassStarsGeometry, thirdPassStarsmaterial)

        thirdPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
        thirdPassStars.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
        thirdPassStars.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

        const randomStarfield = {
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
            }
        }

        this.starfield = randomStarfield
    }

    dispose() {
        if (!this.starfield) {
            console.log(`Can't dispose empty starfield`)
            return
        }

        this.starfield.bright.geometry.dispose()
        this.starfield.firstPass.geometry.dispose()
        this.starfield.secondPass.geometry.dispose()
        this.starfield.thirdPass.geometry.dispose()

        this.starfield.bright.material.dispose()
        this.starfield.firstPass.material.dispose()
        this.starfield.secondPass.material.dispose()
        this.starfield.thirdPass.material.dispose()

        this.scene.remove(
            this.starfield.bright.points,
            this.starfield.firstPass.points,
            this.starfield.secondPass.points,
            this.starfield.thirdPass.points
        )

        this.starfield = null
    }

    show() {
        if (!this.starfield) {
            console.log(`Can't show empty starfield`)
            return
        }

        this.scene.add(
            this.starfield.bright.points,
            this.starfield.firstPass.points,
            this.starfield.secondPass.points,
            this.starfield.thirdPass.points
        )
    }

    _getCoordinateVectorByPosition(position) {
        let coordinateVector = new THREE.Vector3(0, 0, 0)

        //we dont need to tweak coordinates on the origin cluster
        if (position != '0,0,0') {
          const arrayCurrentCluster = position.split(',')

          // handling x axis (right and left) clusters population
          const xCurrentCluster = parseInt(arrayCurrentCluster[0])

          if (xCurrentCluster != 0) {
            coordinateVector.x = (this.parameters.grid.clusterSize) * xCurrentCluster
          }

          // since we're not handling vertical movement at the moment
          // we dont need to handle the y axis

          // handling z axis (forward and backward) clusters population
          const zCurrentCluster = parseInt(arrayCurrentCluster[2])

          if (zCurrentCluster != 0) {
            coordinateVector.z = (this.parameters.grid.clusterSize) * zCurrentCluster
          }
        }

        return coordinateVector
    }

    /**
     * @param {*} max 
     * @returns 
     */
    _getRandomStarsGeometry(randomAttributes) {
        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(randomAttributes.positions, 3)
        )

        geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(randomAttributes.colors, 3)
        )

        return geometry
    }

    _getRandomStarsTexture(type = 'pass') {
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
    _getRandomStarsMaterial(randomMaterialTexture, enforcedSize, enforcedOpacity) {
        const randomMaterialSize = enforcedSize || enforcedSize === 0 ? enforcedSize : THREE.MathUtils.randInt(
            this.parameters.matters.starfield.material.size.pass.min,
            this.parameters.matters.starfield.material.size.pass.max
        )
        const randomMaterialOpacity = enforcedOpacity || enforcedOpacity === 0 ? enforcedOpacity : THREE.MathUtils.randInt(
            this.parameters.matters.starfield.material.opacity.pass.min,
            this.parameters.matters.starfield.material.opacity.pass.max
        )
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

        // todo: maybe a way to set material https://github.com/brunosimon/experiment-rick-and-morty-tribute/blob/master/src/Experience/Particles.js

        return material
    }
}