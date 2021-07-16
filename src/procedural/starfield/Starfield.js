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
                'star3.png'
            ]
        }

        this.starfield = null
    }

    generate(starfieldsVertices) {
        const brightStarsGeometry = this._getRandomStarsGeometry(starfieldsVertices.brightStarsRandomVertices)
        const brightStarTexture = this._getRandomStarsTexture()
        const brightStarsmaterial = this._getRandomStarsMaterial(brightStarTexture, 1)
        const brightStars = new THREE.Points(brightStarsGeometry, brightStarsmaterial)

        const normalStarsGeometry = this._getRandomStarsGeometry(starfieldsVertices.normalStarsRandomVertices)
        const normalStarsTexture = this._getRandomStarsTexture()
        const normalStarsmaterial = this._getRandomStarsMaterial(normalStarsTexture, this._getRandomNumberBeetwen(0.8, 0.9))
        const normalStars = new THREE.Points(normalStarsGeometry, normalStarsmaterial)

        const paleStarsGeometry = this._getRandomStarsGeometry(starfieldsVertices.paleStarsRandomVertices)
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

        this.starfield = randomStarfield
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

        this.starfield = null
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
    _getRandomStarsGeometry(randomVertices) {
        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(randomVertices, 3)
        )

        return geometry
    }

    _getRandomStarsTexture() {
        const randomTextureName = this.texture.pool[
            Math.round(this._getRandomNumberBeetwen(0, this.texture.pool.length - 1))
        ]

        // TODO, might be part of the problem, make a texture handler which download everything at load
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

    _getRandomNumberBeetwen(min, max) {
        return Math.random() * (max - min) + min
    }
}