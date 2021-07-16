import Starfield from './starfield/Starfield'

export default class MultiverseFactory {
    constructor(scene, library) {
        this.scene = scene
        this.library = library
    }

    createMatter = (type, parameters) => {
        switch(type) {
            case "starfield":
              return new Starfield(this.scene, this.library, parameters)
          }
    }
}