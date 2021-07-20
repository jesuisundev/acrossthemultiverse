import * as THREE from 'three'

export default class Library {
    constructor() {
        this.source = {
            textures : {
                starfield : {
                    baseUrl: '/procedural/starfield/texture/',
                    pool: [
                        {type: 'normal', src: 'star1.png'},
                        {type: 'normal', src: 'star2.png'},
                        {type: 'normal', src: 'star3.png'},
                        {type: 'normal', src: 'star4.png'},
                        {type: 'normal', src: 'star5.png'},
                        {type: 'bright', src: 'brightstar1.png'},
                        {type: 'bright', src: 'brightstar2.png'}
                    ]
                }
            }
        }

        this.textures = {
            starfield : {
                normal: [],
                bright: []
            }
        }
    }

    preload() {
        // preload starfield textures
        for(let textureSourceType of Object.keys(this.source.textures)) {
            for(let textureObject of this.source.textures[textureSourceType].pool) {
                if (textureObject.type == 'normal') {
                    this.textures.starfield.normal.push(
                        new THREE.TextureLoader().load(`${this.source.textures[textureSourceType].baseUrl}${textureObject.src}`)
                    )
                }
                
                if (textureObject.type == 'bright') {
                    this.textures.starfield.bright.push(
                        new THREE.TextureLoader().load(`${this.source.textures[textureSourceType].baseUrl}${textureObject.src}`)
                    )
                }
            }
        }
    }
}