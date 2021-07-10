import StarField from '../procedural/starfield'

export default class Grid {
    constructor(scene) {
        // should i use octree for this ? might be overkill actually
        // first we're stick with hashmap and well change later if needed
        this.scene = scene
        this.parameters = {
            sectorSize: 2000
        }
        this.activeSectors = new Map()
        this.initialize()
    }

    getCurrentSectorPosition(currentCameraPosition) {
        const gridChunk = this.parameters.sectorSize / 2
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

        this._populateSectorsWithRandomPopulation(defaultSectorsToPopulate)
    }

    updateGridBySector(currentSector) {
        console.log(currentSector, 'currentSector')
        const neighbourSectors = this.getNeighbourSectors(currentSector)
        const sectorsToPopulate = this._getEmptySectorsToPopulate(neighbourSectors)
        const sectorsToDispose = this._getPopulatedSectorsToDispose(neighbourSectors, currentSector)

        this.disposeSectors(sectorsToDispose)
        console.log(sectorsToPopulate, 'sectorsToPopulate')
        this._populateSectorsWithRandomPopulation(sectorsToPopulate)
    }

    getNeighbourSectors(currentSector) {
        const neighbourSectors = []
        const currentSectorArray = currentSector.split(',')
        const x = currentSectorArray[0]
        const y = currentSectorArray[1]
        const z = currentSectorArray[2]

        // forward
        neighbourSectors.push(
            `${x},${y},${Number(z) - 1}`
        )

        // backward
        neighbourSectors.push(
            `${x},${y},${Number(z) + 1}`
        )

        // right
        neighbourSectors.push(
            `${Number(x) + 1},${y},${z}`
        )

        // left
        neighbourSectors.push(
            `${Number(x) - 1},${y},${z}`
        )

        // forward right
        neighbourSectors.push(
            `${Number(x) + 1},${y},${Number(z) - 1}`
        )

        // forward left
        neighbourSectors.push(
            `${Number(x) - 1},${y},${Number(z) - 1}`
        )

        // backward right
        neighbourSectors.push(
            `${Number(x) + 1},${y},${Number(z) + 1}`
        )

        // backward left
        neighbourSectors.push(
            `${Number(x) - 1},${y},${Number(z) + 1}`
        )

        return neighbourSectors
    }

    disposeSectors(sectorsToDispose) {
        console.log(sectorsToDispose, 'sectorsToDispose')
        for (let sectorToDispose of sectorsToDispose) {
            let objectToDispose = this.activeSectors.get(sectorToDispose)

            objectToDispose.dispose()
            objectToDispose = null

            this.activeSectors.delete(sectorToDispose)
        }

    }

    _getEmptySectorsToPopulate(neighbourSectors) {
        const emptySectorsToPopulate = []
        console.log(neighbourSectors, 'neighbourSectors')
        for (let neighbourSector of neighbourSectors) {
            if (!this.activeSectors.has(neighbourSector))
                emptySectorsToPopulate.push(neighbourSector)
        }

        return emptySectorsToPopulate
    }

    _getPopulatedSectorsToDispose(neighbourSectors, currentSector) {
        const populatedSectorsToDispose = []

        for (let activeSectorKey of this.activeSectors.keys()) {
            if (currentSector != activeSectorKey && !neighbourSectors.includes(activeSectorKey))
                populatedSectorsToDispose.push(activeSectorKey)
        }

        return populatedSectorsToDispose
    }

    _populateSectorsWithRandomPopulation(sectorsToPopulate) {
        // this should randomly populate with different procedual method
        // handling only starfield for now
        for (let sectorToPopulate of sectorsToPopulate) {
            const randomStarfield = new StarField(this.scene)

            randomStarfield.generateRandomStarfieldOnSector(sectorToPopulate, this.parameters.sectorSize)

            this.activeSectors.set(sectorToPopulate, randomStarfield)

            this.scene.add(
                randomStarfield.starfield.bright.points,
                randomStarfield.starfield.normal.points,
                randomStarfield.starfield.pale.points
            )
        }
    }
}