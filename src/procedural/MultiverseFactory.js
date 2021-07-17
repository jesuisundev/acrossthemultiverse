import Starfield from './starfield/Starfield'

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
          }
    }
}