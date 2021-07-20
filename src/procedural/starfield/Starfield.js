import * as THREE from 'three'

export default class StarField {
    constructor(scene, library, parameters) {
        this.scene = scene
        this.library = library
        this.parameters = parameters.matters.starfield
        this.starfield = null
    }

    generate(starfieldsAttributes) {
        const normalStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.normalStarsRandomAttributes)
        const normalStarsTexture = this._getRandomStarsTexture('normal', 1)
        const normalStarsmaterial = this._getRandomStarsMaterial(normalStarsTexture, this.parameters.material.size.min, this.parameters.material.opacity.min)
        const normalStars = new THREE.Points(normalStarsGeometry, normalStarsmaterial)

        const brightStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.brightStarsRandomAttributes)
        const brightStarTexture = this._getRandomStarsTexture('bright')
        
        const brightStarsmaterial = this._getRandomStarsMaterial(brightStarTexture, THREE.MathUtils.randInt(50, 200))
        const brightStars = new THREE.Points(brightStarsGeometry, brightStarsmaterial)

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

    _getRandomStarsTexture(type = 'normal', enforcedTextureIndex) {
        const currentTexturesPool = this.library.textures.starfield[type]
        const randomTexture = currentTexturesPool[
            enforcedTextureIndex || enforcedTextureIndex === 0 ? enforcedTextureIndex : THREE.MathUtils.randInt(0, currentTexturesPool.length - 1)
        ]

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
            this.parameters.material.size.min,
            this.parameters.material.size.max
        )
        const randomMaterialOpacity = enforcedOpacity || enforcedOpacity === 0 ? enforcedOpacity : THREE.MathUtils.randInt(
            this.parameters.material.opacity.min,
            this.parameters.material.opacity.max
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

        material.onBeforeCompile = function ( shader ) {

            shader.fragmentShader = shader.fragmentShader.replace(
                'gl_FragColor = vec4( packNormalToRGB( normal ), opacity );',
                [
                'gl_FragColor = vec4( packNormalToRGB( normal ), opacity );',
                'gl_FragColor.a *= pow( gl_FragCoord.z, 50.0 );',
                ].join( '\n' )
            )
        
        }

        return material
    }
}