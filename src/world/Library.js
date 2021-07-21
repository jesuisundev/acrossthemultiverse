import * as THREE from 'three'

export default class Library {
    constructor() {
        this.source = {
            textures : {
                starfield : {
                    baseUrl: '/procedural/starfield/texture/',
                    pool: [
                        {type: 'pass', src: 'star1.png'},
                        {type: 'pass', src: 'star2.png'},
                        {type: 'pass', src: 'star3.png'},
                        {type: 'pass', src: 'star4.png'},
                        {type: 'pass', src: 'star5.png'},
                        {type: 'pass', src: 'star6.png'},
                        {type: 'pass', src: 'star7.png'},
                        {type: 'pass', src: 'star8.png'},
                        {type: 'pass', src: 'star9.png'},
                        {type: 'pass', src: 'star10.png'},
                        {type: 'bright', src: 'brightstar1.png'},
                        {type: 'bright', src: 'brightstar2.png'},
                        {type: 'bright', src: 'brightstar3.png'},
                        {type: 'bright', src: 'brightstar4.png'}
                    ]
                }
            }
        }

        this.textures = {
            starfield : {
                pass: [],
                bright: []
            }
        }
    }

    preload() {
        // preload starfield textures
        for(let textureSourceType of Object.keys(this.source.textures)) {
            for(let textureObject of this.source.textures[textureSourceType].pool) {
                if (textureObject.type == 'pass') {
                    this.textures.starfield.pass.push(
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