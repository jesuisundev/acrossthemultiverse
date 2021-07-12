import * as THREE from 'three'

export default class StarField {
    constructor(scene) {
        this.scene = scene
        this.parameters = {
            budget: 100000,
            material: {
                size: {
                    min: 4,
                    max: 5
                },
                opacity: {
                    min: 1,
                    max: 1
                }
            }
        }

        this.texture = {
            baseUrl: '/procedural/starfield/texture/',
            pool: [
                'star1.png',
                'star2.png',
                'star3.png',
                'star4.png'
            ]
        }

        this.starfield = null
    }

    getRandomStarfield(currentSector, sectorSize, starfieldsVertices) {
        const countMaxByType = Math.floor(this.parameters.budget / 3)

        const brightStarsGeometry = this._getRandomStarsGeometry(
            this._getRandomNumberBeetwen(Math.floor(countMaxByType / 0.5), countMaxByType),
            currentSector,
            sectorSize,
            starfieldsVertices?.brightStarsRandomVertices
        )
        const brightStarTexture = this._getRandomStarsTexture()
        const brightStarsmaterial = this._getRandomStarsMaterial(brightStarTexture, 1)
        const brightStars = new THREE.Points(brightStarsGeometry, brightStarsmaterial)

        const normalStarsGeometry = this._getRandomStarsGeometry(this._getRandomNumberBeetwen(Math.floor(countMaxByType / 2), countMaxByType), currentSector, sectorSize, starfieldsVertices?.normalStarsRandomVertices)
        const normalStarsTexture = this._getRandomStarsTexture()
        const normalStarsmaterial = this._getRandomStarsMaterial(normalStarsTexture, this._getRandomNumberBeetwen(0.8, 0.9))
        const normalStars = new THREE.Points(normalStarsGeometry, normalStarsmaterial)

        const paleStarsGeometry = this._getRandomStarsGeometry(this._getRandomNumberBeetwen(Math.floor(countMaxByType / 4), countMaxByType), currentSector, sectorSize, starfieldsVertices?.paleStarsRandomVertices)
        const paleStarsTexture = this._getRandomStarsTexture()
        const paleStarsmaterial = this._getRandomStarsMaterial(paleStarsTexture, this._getRandomNumberBeetwen(0.3, 0.4))
        const paleStars = new THREE.Points(paleStarsGeometry, paleStarsmaterial)

        const randomStarfield = {
            bright: {
                geometry: brightStarsGeometry,
                texture: brightStarTexture,
                material: brightStarsmaterial,
                points: brightStars
            },
            normal: {
                geometry: normalStarsGeometry,
                texture: normalStarsTexture,
                material: normalStarsmaterial,
                points: normalStars
            },
            pale: {
                geometry: paleStarsGeometry,
                texture: paleStarsTexture,
                material: paleStarsmaterial,
                points: paleStars
            }
        }

        return randomStarfield
    }

    generateRandomStarfieldOnSector(currentSector, sectorSize) {
        this.starfield = this.getRandomStarfield(currentSector, sectorSize)
    }

    setStarfield(starfield) {
        this.starfield = starfield
    }

    dispose() {
        if (!this.starfield) {
            console.log(`Can't dispose empty starfield`)
            return
        }

        this.starfield.bright.geometry.dispose()
        this.starfield.normal.geometry.dispose()
        this.starfield.pale.geometry.dispose()

        this.starfield.bright.material.dispose()
        this.starfield.normal.material.dispose()
        this.starfield.pale.material.dispose()

        this.scene.remove(
            this.starfield.bright.points,
            this.starfield.normal.points,
            this.starfield.pale.points
        )
    }

    show() {
        if (!this.starfield) {
            console.log(`Can't show empty starfield`)
            return
        }

        this.scene.add(
            this.starfield.bright.points,
            this.starfield.normal.points,
            this.starfield.pale.points
        )
    }

    /**
     * TODO
     * @param {*} max 
     * @returns 
     */
    _getRandomStarsGeometry(max, currentSector, sectorSize, randomVertices) {
        const geometry = new THREE.BufferGeometry()
        const vertices = randomVertices ? randomVertices : this._getVerticesInRandomPosition(max, currentSector, sectorSize)

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
        )

        return geometry
    }

    _getRandomStarsTexture() {
        const randomTextureName = this.texture.pool[
            Math.round(this._getRandomNumberBeetwen(0, this.texture.pool.length - 1))
        ]

        return new THREE.TextureLoader().load(`${this.texture.baseUrl}${randomTextureName}`)
    }

    /**
     * TODO
     * @param {*} texture 
     * @param {*} opacity 
     * @param {*} size 
     * @returns 
     */
    _getRandomStarsMaterial(randomMaterialTexture, enforcedOpacity, enforcedSize) {
        const randomMaterialSize = enforcedSize ? enforcedSize : this._getRandomNumberBeetwen(
            this.parameters.material.size.min,
            this.parameters.material.size.max
        )
        const randomMaterialOpacity = enforcedOpacity ? enforcedOpacity : this._getRandomNumberBeetwen(
            this.parameters.material.opacity.min,
            this.parameters.material.opacity.max
        )

        return new THREE.PointsMaterial({
            size: randomMaterialSize,
            opacity: randomMaterialOpacity,
            map: randomMaterialTexture,
            sizeAttenuation: true,
            depthWrite: false,
            transparent: true,
            blending: THREE.AdditiveBlending
        })
    }

    /**
     * TODO
     * @param {*} max 
     * @returns 
     */
    _getVerticesInRandomPosition(max, currentSector, sectorSize) {
        const vertices = []


        for (let i = 0; i < max; i++) {
            // creating coordinate for the particles in random positions but confined in the current square sector
            let x = sectorSize * Math.random() - (sectorSize / 2)
            let y = sectorSize * Math.random() - (sectorSize / 2)
            let z = sectorSize * Math.random() - (sectorSize / 2)

            // we dont need to tweak coordinates on the origin sector
            if (currentSector != '0,0,0') {
                const arrayCurrentSector = currentSector.split(',')

                // handling x axis (right and left) sectors population
                if (arrayCurrentSector[0] != 0)
                    x = (x + (sectorSize * arrayCurrentSector[0]))

                // since we're not handling vertical movement at the moment
                // we dont need to handle the y axis

                // handling z axis (forward and backward) sectors population
                if (arrayCurrentSector[2] != 0)
                    z = (z + (sectorSize * arrayCurrentSector[2]))
            }

            vertices.push(x, y, z)
        }

        return vertices
    }

    _getRandomNumberBeetwen(min, max) {
        return Math.random() * (max - min) + min
    }
}