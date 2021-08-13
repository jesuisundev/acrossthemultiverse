import Wormhole from './wormhole/Wormhole'
import { gsap } from 'gsap'

export default class Sequencer {
  constructor (scene, library, parameters, grid, camera) {
    this.scene = scene
    this.library = library
    this.parameters = parameters
    this.grid = grid
    this.camera = camera

    this.wormhole = new Wormhole(this.scene, this.library, this.parameters)
  }

  async startWormholeSequence () {
    await this.fadeInBlackWall()

    this.stopAllSounds()
    this.startSoundByTitle('oceansoftime')

    this.resetScene()

    this.wormhole.generate()
    this.wormhole.active()

    await this.fadeOutBlackWall()
  }

  async fadeInBlackWall () {
    const blackwallElement = document.querySelector('#blackwall')

    blackwallElement.style.opacity = 0
    blackwallElement.style.zIndex = 9

    return gsap.to(blackwallElement.style, {
      duration: 2,
      ease: 'power2.out',
      opacity: 1
    }).then(() => true)
  }

  async fadeOutBlackWall () {
    const blackwallElement = document.querySelector('#blackwall')

    blackwallElement.style.opacity = 1

    return gsap.to(blackwallElement.style, {
      duration: 2,
      ease: 'power2.out',
      opacity: 0
    }).then(() => {
      blackwallElement.style.zIndex = 7
      return true
    })
  }

  stopAllSounds () {
    Object.keys(this.library.audio).forEach(key => this.library.audio[key].stop())
  }

  startSoundByTitle (title) {
    this.library.audio[title].play()
  }

  resetScene () {
    const arrayActiveClusters = Array.from(this.grid.activeClusters.keys())

    this.grid.disposeClusters(arrayActiveClusters)

    this.camera.position.set(0, 0, 0)
  }
}
