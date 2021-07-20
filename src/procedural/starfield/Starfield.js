import * as THREE from 'three'

export default class StarField {
    constructor(scene, library, parameters) {
        this.scene = scene
        this.library = library
        this.parameters = parameters.matters.starfield

        this.textureSeen = []
        this.starfield = null
    }

    generate(starfieldsAttributes) {
        const brightStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.brightStarsRandomAttributes)
        const brightStarTexture = this._getRandomStarsTexture('bright')
        const brightStarsmaterial = this._getRandomStarsMaterial(brightStarTexture, THREE.MathUtils.randInt(50, 150))
        const brightStars = new THREE.Points(brightStarsGeometry, brightStarsmaterial)

        const firstPassStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.firstPassStarsRandomAttributes)
        const firstPassStarsTexture = this._getRandomStarsTexture()
        const firstPassStarsmaterial = this._getRandomStarsMaterial(firstPassStarsTexture)
        const firstPassStars = new THREE.Points(firstPassStarsGeometry, firstPassStarsmaterial)

        const secondPassStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.secondPassStarsRandomAttributes)
        const secondPassStarsTexture = this._getRandomStarsTexture()
        const secondPassStarsmaterial = this._getRandomStarsMaterial(secondPassStarsTexture)
        const secondPassStars = new THREE.Points(secondPassStarsGeometry, secondPassStarsmaterial)

        const thirdPassStarsGeometry = this._getRandomStarsGeometry(starfieldsAttributes.thirdPassStarsRandomAttributes)
        const thirdPassStarsTexture = this._getRandomStarsTexture()
        const thirdPassStarsmaterial = this._getRandomStarsMaterial(thirdPassStarsTexture)
        const thirdPassStars = new THREE.Points(thirdPassStarsGeometry, thirdPassStarsmaterial)

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

        // material.onBeforeCompile = function ( shader ) {

        //     shader.fragmentShader = shader.fragmentShader.replace(
        //         'gl_FragColor = vec4( packfirstPassToRGB( firstPass ), opacity );',
        //         [
        //         'gl_FragColor = vec4( packfirstPassToRGB( firstPass ), opacity );',
        //         'gl_FragColor.a *= pow( gl_FragCoord.z, 50.0 );',
        //         ].join( '\n' )
        //     )
        
        // }

        return material
    }
}