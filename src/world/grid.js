import StarField from '../procedural/starfield'

export default class Grid {
    constructor() {
        // should i use octree for this ? might be overkill actually
        // first we're stick with hashmap and well change later if needed
        this.activeSectors = new Map()
        this.initialize()
    }

    static getCurrentSectorPosition(currentCameraPosition, gridSectorSize) {
        const gridChunk = gridSectorSize / 2
        const xCoordinate = Math.trunc(currentCameraPosition.x / gridChunk)
        const yCoordinate = Math.trunc(currentCameraPosition.y / gridChunk)
        const zCoordinate = Math.trunc(currentCameraPosition.z / gridChunk)
        const currentSectorPosition = `${xCoordinate},${yCoordinate},${zCoordinate}`

        return currentSectorPosition
    }

    initialize() {
        const defaultSectorsToPopulate = [
            '0,0,0', // center of all, by default the camera will be there
            '0,0,-1', // forward
            '0,0,1', // backward
            '1,0,0', // right
            '-1,0,0', // left
            '1,0,-1', // forward right
            '-1,0,-1', // forward left
            '1,0,1', // backward right
            '-1,0,1', // backward left
        ]

        for (let sectorToPopulate of defaultSectorsToPopulate) {
            this._populateSectorWithRandomPopulation(sectorToPopulate)
        }
    }

    _populateSectorWithRandomPopulation(sectorToPopulate) {
        console.log(sectorToPopulate)
        const currentStarfield = new StarField()
    }
}