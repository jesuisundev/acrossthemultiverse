import Starfield from './starfield/Starfield'

export default class MultiverseFactory {
    constructor(scene) {
        this.scene = scene
    }

    createMatter = (type, parameters) => {
        switch(type) {
            case "starfield":
              return new Starfield(this.scene, parameters)
          }
    }
}