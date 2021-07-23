import Starfield from './starfield/Starfield'
import Nebula from './nebula/Nebula'

export default class MultiverseFactory {
    constructor(scene, library, parameters) {
        this.scene = scene
        this.library = library
        this.parameters = parameters
    }

    createMatter = type => {
        switch(type) {
            case "starfield":
              return new Starfield(this.scene, this.library, this.parameters)

            case "nebula":
                return new Nebula(this.scene, this.library, this.parameters)
          }
    }
}