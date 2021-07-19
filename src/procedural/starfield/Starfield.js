import * as THREE from 'three'

export default class StarField {
    constructor(scene, library, parameters) {
        this.scene = scene
        this.library = library
        this.parameters = parameters.matters.starfield
        this.starfield = null
    }

    generate(starfieldsAttributes) {
        const brightStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.brightStarsRandomAttributes)
        const brightStarTexture = this._getRandomStarsTexture()
        const brightStarsmaterial = this._getRandomStarsMaterial(brightStarTexture)
        const brightStars = new THREE.Points(brightStarsGeometry, brightStarsmaterial)

        const normalStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.normalStarsRandomAttributes)
        const normalStarsTexture = this._getRandomStarsTexture()
        const normalStarsmaterial = this._getRandomStarsMaterial(normalStarsTexture)
        const normalStars = new THREE.Points(normalStarsGeometry, normalStarsmaterial)

        const paleStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.normalStarsRandomAttributes)
        const paleStarsTexture = this._getRandomStarsTexture()
        const paleStarsmaterial = this._getRandomStarsMaterial(paleStarsTexture)
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

    _getRandomStarsTexture() {
        const randomTexture = this.library.textures.starfield[
            Math.round(this._getRandomNumberBeetwen(0, this.library.textures.starfield.length - 1))
        ]

        return randomTexture
    }

    /**
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
        randomMaterialTexture.magFilter = THREE.NearestFilter

        return new THREE.PointsMaterial({
            size: randomMaterialSize,
            opacity: randomMaterialOpacity,
            map: randomMaterialTexture,
            sizeAttenuation: true,
            depthWrite: false,
            transparent: true,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        })
    }

    _getRandomNumberBeetwen(min, max) {
        return Math.random() * (max - min) + min
    }
}