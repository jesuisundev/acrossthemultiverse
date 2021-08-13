import * as THREE from 'three'

export default class Library {
  constructor () {
    this.source = {
      textures: {
        starfield: {
          baseUrl: '/textures/starfield/',
          pool: [
            { type: 'pass', src: 'star1.png' },
            { type: 'pass', src: 'star2.png' },
            { type: 'pass', src: 'star3.png' },
            { type: 'pass', src: 'star4.png' },
            { type: 'pass', src: 'star5.png' },
            { type: 'pass', src: 'star6.png' },
            { type: 'pass', src: 'star7.png' },
            { type: 'pass', src: 'star8.png' },
            { type: 'bright', src: 'brightstar1.png' },
            { type: 'bright', src: 'brightstar2.png' },
            { type: 'bright', src: 'brightstar3.png' },
            { type: 'bright', src: 'brightstar4.png' }
          ]
        },
        nebula: {
          baseUrl: '/textures/nebula/',
          pool: [
            { type: 'cloud', src: 'cloud1.png' },
            { type: 'cloud', src: 'cloud2.png' },
            { type: 'cloud', src: 'cloud3.png' },
            { type: 'cloud', src: 'cloud4.png' }
          ]
        },
        blackhole: {
          baseUrl: '/textures/blackhole/',
          pool: [
            { type: 'disk', src: 'disk.jpg' }
          ]
        },
        wormhole: {
          baseUrl: '/textures/wormhole/',
          pool: [
            { type: 'galaxy', src: 'galaxy1.jpg' },
            { type: 'galaxy', src: 'galaxy2.png' },
            { type: 'galaxy', src: 'galaxy3.jpg' },
            { type: 'galaxy', src: 'galaxy4.jpg' }
          ]
        }
      }
    }

    this.textures = {
      starfield: {
        pass: [],
        bright: []
      },
      nebula: {
        cloud: []
      },
      blackhole: {
        disk: []
      },
      wormhole: {
        galaxy: []
      }
    }
  }

  preload () {
    // preloading all textures
    for (const textureSourceType of Object.keys(this.source.textures)) {
      for (const textureObject of this.source.textures[textureSourceType].pool) {
        const currentTexture = new THREE.TextureLoader().load(
                    `${this.source.textures[textureSourceType].baseUrl}${textureObject.src}`
        )
        currentTexture.premultiplyAlpha = true

        this.textures[textureSourceType][textureObject.type].push(currentTexture)
      }
    }
  }
}
