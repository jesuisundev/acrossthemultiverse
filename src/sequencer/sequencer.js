import Wormhole from './wormhole/Wormhole'
import { gsap } from 'gsap'

export default class Sequencer {
  constructor (scene, library, parameters, grid, camera) {
    this.scene = scene
    this.library = library
    this.parameters = parameters
    this.grid = grid
    this.camera = camera

    this.currentChapter = 0
    this.active = false

    this.wormhole = new Wormhole(this.scene, this.library, this.parameters)
  }

  async launchNextSequence () {
    switch (this.currentChapter) {
      case 0:
        await this.chapterOneSequence()
        break

      case 1:
        await this.chapterTwoSequence()
        break

      case 2:
        await this.chapterThreeSequence()
        break

      case 3:
        await this.epiphanySequence()
        break

      default:
        console.error('Unknow chapter', this.currentChapter)
        break
    }
  }

  async chapterOneSequence () {
    this.currentChapter++

    this.active = false
  }

  async chapterTwoSequence () {
    this.currentChapter++

    this.active = false
  }

  async chapterThreeSequence () {
    this.currentChapter++

    this.active = false
  }

  async epiphanySequence () {
    this.currentChapter++

    this.active = false
  }

  async wormholeSequence () {
    this.stopAllSounds()

    await this.fadeInWallById('#blackwall')

    this.resetScene()

    this.wormhole.generate()
    this.wormhole.active()

    this.startSoundByTitle('wormhole')
    this.fadeOutWallById('#blackwall', 0.5)

    await this.wormhole.animate()

    await this.fadeInWallById('#whitewall', 1)

    this.wormhole.dispose()

    await this.launchNextSequence()
  }

  async fadeInWallById (id, duration = 2) {
    const element = document.querySelector(id)

    element.style.opacity = 0
    element.style.zIndex = 9

    return gsap.to(element.style, {
      duration: duration,
      ease: 'power2.out',
      opacity: 1
    }).then(() => true)
  }

  async fadeOutWallById (id, duration = 2) {
    const element = document.querySelector(id)

    element.style.opacity = 1

    return gsap.to(element.style, {
      duration: duration,
      ease: 'power2.out',
      opacity: 0
    }).then(() => {
      element.style.zIndex = 7
      return true
    })
  }

  stopAllSounds () {
    Object.keys(this.library.audio).forEach(key => this.library.audio[key].stop())
  }

  startSoundByTitle (title) {
    this.library.audio[title].play()
  }

  async asyncWaitFor (milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  resetScene () {
    const arrayActiveClusters = Array.from(this.grid.activeClusters.keys())

    this.grid.disposeClusters(arrayActiveClusters)

    this.camera.position.set(0, 0, 0)
  }
}
