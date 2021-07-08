export default class StarField {
    constructor(scene) {
        this.scene = scene

        this.parameters = {
            budget: 50000,
            squareSectorSize: 2000,
            material: {
                size: {
                    min: 1,
                    max: 5
                },
                opacity: {
                    min: 0.2,
                    max: 1
                }
            }
        }

        this.texture = {
            baseUrl: 'procedural/starfield/texture/',
            pool: [
                'star1.png',
                'star2.png'
            ]
        }
    }

    generateRandomStarfieldOnSector(currentSector) {
        const starfied = _generatedRandomStarfield(currentSector)
    }

    _generatedRandomStarfield(sector) {
        const brightStarsGeometry = _getRandomStarsGeometry(20000, currentSector)
        const brightStarTexture = _getRandomStarsTexture()
        const brightStarsmaterial = _getRandomStarsMaterial(brightStarTexture, _getRandomNumberBeetwen(0.8, 1))
        const brightStars = new THREE.Points(brightStarsGeometry, brightStarsmaterial)

        const normalStarsGeometry = _getRandomStarsGeometry(20000, currentSector)
        const normalStarsTexture = _getRandomStarsTexture()
        const normalStarsmaterial = _getRandomStarsMaterial(normalStarsTexture, _getRandomNumberBeetwen(0.4, 0.6))
        const normalStars = new THREE.Points(normalStarsGeometry, normalStarsmaterial)

        const paleStarsGeometry = _getRandomStarsGeometry(20000, currentSector)
        const paleStarsTexture = _getRandomStarsTexture()
        const paleStarsmaterial = _getRandomStarsMaterial(paleStarsTexture, _getRandomNumberBeetwen(0.05, 0.2))
        const paleStars = new THREE.Points(paleStarsGeometry, paleStarsmaterial)


        const randomStarfield = {
            'bright': {
                'geometry': brightStarsGeometry,
                'texture': brightStarTexture,
                'material': brightStarsmaterial,
                'points': brightStars
            },
            'normal': {
                'geometry': normalStarsGeometry,
                'texture': normalStarsTexture,
                'material': normalStarsmaterial,
                'points': normalStars
            },
            'pale': {
                'geometry': paleStarsGeometry,
                'texture': paleStarsTexture,
                'material': paleStarsmaterial,
                'points': paleStars
            }
        }

        return randomStarfield
    }

    /**
     * TODO
     * @param {*} max 
     * @returns 
     */
    _getRandomStarsGeometry(max, currentSector) {
        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(_getVerticesInRandomPosition(max, currentSector), 3)
        )

        return geometry
    }

    _getRandomStarsTexture() {
        const randomTextureName = this.texture.pool[
            this._getRandomNumberBeetwen(0, this.texture.pool.length - 1)
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
        const randomMaterialSize = enforcedSize ? enforcedSize : _getRandomNumberBeetwen(
            this.parameters.material.size.min,
            this.parameters.material.size.max
        )
        const randomMaterialOpacity = enforcedOpacity ? enforcedOpacity : _getRandomNumberBeetwen(
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
    _getVerticesInRandomPosition(max, currentSector) {
        const vertices = []
        const sectorSize = parameters.starfield.squareSectorSize

        for (let i = 0; i < max; i++) {
            // creating coordinate for the particles in random positions but confined in the current square sector
            let x = sectorSize * Math.random() - (sectorSize / 2)
            let y = sectorSize * Math.random() - (sectorSize / 2)
            let z = sectorSize * Math.random() - (sectorSize / 2)

            // we dont need to tweak coordinates on the origin sector
            if (currentSector != '0,0,0') {
                const arrayCurrentSector = currentSector.split(',')

                // handling x axis  right and left sectors population
                if (arrayCurrentSector[0] != 0)
                    x = (x + (sectorSize * arrayCurrentSector[0]))

                // since we're not handling vertical movement at the moment
                // we dont need to handle the y axis

                // handling x axis  right and left sectors population
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