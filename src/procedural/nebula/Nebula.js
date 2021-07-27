import * as THREE from 'three'

export default class Nebula {
    constructor(scene, library, parameters) {
        this.scene = scene
        this.library = library
        this.parameters = parameters

        this.textureSeen = []
        this.nebula = null
    }

    generate(nebulasAttributes, position, subtype = null) {
        if(subtype === 'remnant')
            return this._generateRemnant(nebulasAttributes, position)

        const currentCoordinateVector = this._getCoordinateVectorByPosition(position)

        const cloudGeometry = this._getGeometry(nebulasAttributes.gazRandomAttributes)
        const cloudTexture = this._getRandomTexture('cloud')
        const cloudMaterial = this._getMaterial(
            cloudTexture,
            THREE.MathUtils.randInt(
                this.parameters.matters.nebula.material.size.cloud.min,
                this.parameters.matters.nebula.material.size.cloud.max
            ),
            THREE.MathUtils.randInt(
                this.parameters.matters.nebula.material.opacity.cloud.min,
                this.parameters.matters.nebula.material.opacity.cloud.max
            )
        )
        const cloud = new THREE.Points(cloudGeometry, cloudMaterial)

        cloud.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
        cloud.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
        cloud.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

        const firstPassStarsGeometry = this._getGeometry(nebulasAttributes.firstPassStarsRandomAttributes)
        const firstPassStarsTexture = this._getRandomTexture()
        const firstPassStarsmaterial = this._getMaterial(firstPassStarsTexture)
        const firstPassStars = new THREE.Points(firstPassStarsGeometry, firstPassStarsmaterial)

        firstPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
        firstPassStarsGeometry.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
        firstPassStarsGeometry.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

        const secondPassStarsGeometry = this._getGeometry(nebulasAttributes.secondPassStarsRandomAttributes)
        const secondPassStarsTexture = this._getRandomTexture('bright')
        const secondPassStarsmaterial = this._getMaterial(secondPassStarsTexture, THREE.MathUtils.randInt(
            this.parameters.matters.nebula.material.size.bright.min,
            this.parameters.matters.nebula.material.size.bright.max
        ))
        const secondPassStars = new THREE.Points(secondPassStarsGeometry, secondPassStarsmaterial)

        secondPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
        secondPassStars.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
        secondPassStars.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

        const thirdPassStarsGeometry = this._getGeometry(nebulasAttributes.thirdPassStarsRandomAttributes)
        const thirdPassStarsTexture = this._getRandomTexture()
        const thirdPassStarsmaterial = this._getMaterial(thirdPassStarsTexture)
        const thirdPassStars = new THREE.Points(thirdPassStarsGeometry, thirdPassStarsmaterial)

        thirdPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)
        thirdPassStars.rotateX(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))
        thirdPassStars.rotateZ(THREE.Math.degToRad(THREE.MathUtils.randInt(0, 360)))

        const randomNebula = {
            cloud: {
                geometry: cloudGeometry,
                texture: cloudTexture,
                material: cloudMaterial,
                points: cloud
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

        this.nebula = randomNebula
    }

    _generateRemnant(nebulasAttributes, position) {
        const adjustPositionGaz = 20000
        const currentCoordinateVector = this._getCoordinateVectorByPosition(position)

        const cloudGeometry = this._getGeometry(nebulasAttributes.gazRandomAttributes)
        const cloudTexture = this._getRandomTexture('cloud')
        const cloudMaterial = this._getMaterial(
            cloudTexture,
            THREE.MathUtils.randInt(
                this.parameters.matters.nebula.material.size.cloud.min,
                this.parameters.matters.nebula.material.size.cloud.max
            ),
            THREE.MathUtils.randInt(
                this.parameters.matters.nebula.material.opacity.cloud.min - 0.002,
                this.parameters.matters.nebula.material.opacity.cloud.max - 0.002
            )
        )
        const cloud = new THREE.Points(cloudGeometry, cloudMaterial)

        cloud.position.set(
            currentCoordinateVector.x + adjustPositionGaz,
            currentCoordinateVector.y + adjustPositionGaz,
            currentCoordinateVector.z + adjustPositionGaz
        )

        const firstPassStarsGeometry = this._getGeometry(nebulasAttributes.firstPassStarsRandomAttributes)
        const firstPassStarsTexture = this._getRandomTexture()
        const firstPassStarsmaterial = this._getMaterial(firstPassStarsTexture)
        const firstPassStars = new THREE.Points(firstPassStarsGeometry, firstPassStarsmaterial)

        firstPassStars.position.set(
            currentCoordinateVector.x + adjustPositionGaz,
            currentCoordinateVector.y + adjustPositionGaz,
            currentCoordinateVector.z + adjustPositionGaz
        )

        const secondPassStarsGeometry = this._getGeometry(nebulasAttributes.secondPassStarsRandomAttributes)
        const secondPassStarsTexture = this._getRandomTexture('cloud')
        const secondPassStarsmaterial = this._getMaterial(
            secondPassStarsTexture,
            THREE.MathUtils.randInt(
                this.parameters.matters.nebula.material.size.cloud.min,
                this.parameters.matters.nebula.material.size.cloud.max
            ),
            THREE.MathUtils.randInt(
                this.parameters.matters.nebula.material.opacity.cloud.min + 0.01,
                this.parameters.matters.nebula.material.opacity.cloud.max + 0.01
        ))
        const secondPassStars = new THREE.Points(secondPassStarsGeometry, secondPassStarsmaterial)

        secondPassStars.position.set(
            currentCoordinateVector.x + adjustPositionGaz - 5000,
            currentCoordinateVector.y + adjustPositionGaz - 10000,
            currentCoordinateVector.z + adjustPositionGaz
        )

        const thirdPassStarsGeometry = this._getGeometry(nebulasAttributes.thirdPassStarsRandomAttributes)
        const thirdPassStarsTexture = this._getRandomTexture()
        const thirdPassStarsmaterial = this._getMaterial(thirdPassStarsTexture)
        const thirdPassStars = new THREE.Points(thirdPassStarsGeometry, thirdPassStarsmaterial)

        thirdPassStars.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)

        const randomNebula = {
            cloud: {
                geometry: cloudGeometry,
                texture: cloudTexture,
                material: cloudMaterial,
                points: cloud
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

        this.nebula = randomNebula
    }

    dispose() {
        if (!this.nebula) {
            console.log(`Can't dispose empty nebula`)
            return
        }

        this.nebula.cloud.geometry.dispose()
        this.nebula.firstPass.geometry.dispose()
        this.nebula.secondPass.geometry.dispose()
        this.nebula.thirdPass.geometry.dispose()

        this.nebula.cloud.material.dispose()
        this.nebula.firstPass.material.dispose()
        this.nebula.secondPass.material.dispose()
        this.nebula.thirdPass.material.dispose()

        this.scene.remove(
            this.nebula.cloud.points,
            this.nebula.firstPass.points,
            this.nebula.secondPass.points,
            this.nebula.thirdPass.points
        )

        this.nebula = null
    }

    show() {
        if (!this.nebula) {
            console.log(`Can't show empty nebula`)
            return
        }

        this.scene.add(
            this.nebula.cloud.points,
            this.nebula.firstPass.points,
            this.nebula.secondPass.points,
            this.nebula.thirdPass.points
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
     _getGeometry(randomAttributes) {
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

    _getRandomTexture(type = 'pass') {
        let currentTexturesPool

        if(type === 'pass' || type === 'bright') {
            currentTexturesPool = this.library.textures.starfield[type].filter(texture => !this.textureSeen.includes(texture))
        } else {
            currentTexturesPool = this.library.textures.nebula[type].filter(texture => !this.textureSeen.includes(texture))
        }

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
    _getMaterial(randomMaterialTexture, enforcedSize, enforcedOpacity) {
        const randomMaterialSize = enforcedSize || enforcedSize === 0 ? enforcedSize : THREE.MathUtils.randInt(
            this.parameters.matters.nebula.material.size.pass.min,
            this.parameters.matters.nebula.material.size.pass.max
        )
        const randomMaterialOpacity = enforcedOpacity || enforcedOpacity === 0 ? enforcedOpacity : THREE.MathUtils.randInt(
            this.parameters.matters.nebula.material.opacity.pass.min,
            this.parameters.matters.nebula.material.opacity.pass.max
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

        return material
    }
}