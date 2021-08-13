import Wormhole from './wormhole/Wormhole'

export default class Sequencer {
  constructor (scene, library, parameters) {
    this.scene = scene
    this.library = library
    this.parameters = parameters

    this.wormhole = new Wormhole(this.scene, this.library, this.parameters)
  }

  startWormholeSequence () {
    this.wormhole.generate()
    this.wormhole.active()
  }
}
