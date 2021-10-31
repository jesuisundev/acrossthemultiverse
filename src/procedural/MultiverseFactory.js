import Starfield from './starfield/Starfield'
import Nebula from './nebula/Nebula'
import Galaxy from './galaxy/Galaxy'
import Giant from './giant/Giant'
import Singularity from './singularity/Singularity'
import Spaceship from './spaceship/Spaceship'

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
            
            case "galaxy":
                return new Galaxy(this.scene, this.library, this.parameters)

            case "giant":
                return new Giant(this.scene, this.library, this.parameters)

            case "singularity":
                return new Singularity(this.scene, this.library, this.parameters)
            
            case "spaceship":
                return new Spaceship(this.scene, this.library, this.parameters)
          }
    }
}