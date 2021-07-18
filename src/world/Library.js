import * as THREE from 'three'

export default class Library {
    constructor() {
        this.source = {
            textures : {
                starfield : {
                    baseUrl: '/procedural/starfield/texture/',
                    pool: [
                        'star1.png',
                        'star2.png',
                        'star3.png',
                        'star4.png'
                    ]
                }
            }
        }

        this.textures = {
            starfield : []
        }
    }

    preload() {
        // preload textures
        for(let textureSourceType of Object.keys(this.source.textures)) {
            for(let file of this.source.textures[textureSourceType].pool) {
                this.textures.starfield.push(
                    new THREE.TextureLoader().load(`${this.source.textures[textureSourceType].baseUrl}${file}`)
                )
            }
        }
    }
}