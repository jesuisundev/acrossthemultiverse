import StarField from '../procedural/starfield'

export default class Grid {
    constructor() {
        // should i use octree for this ? might be overkill actually
        // first we're stick with hashmap and well change later if needed
        this.activeSectors = new Map()
        this.queueSectors = new Map()

        this.parameters = {
            sectorSize: 2000
        }
    }

    getCurrentSectorPosition(currentCameraPosition) {
        const gridChunk = this.parameters.sectorSize / 2
        const xCoordinate = Math.trunc(currentCameraPosition.x / gridChunk)
        const yCoordinate = Math.trunc(currentCameraPosition.y / gridChunk)
        const zCoordinate = Math.trunc(currentCameraPosition.z / gridChunk)
        const currentSectorPosition = `${xCoordinate},${yCoordinate},${zCoordinate}`

        return currentSectorPosition
    }

    updateGridBySector(currentSector) {
        const neighbourSectors = this.getNeighbourSectors(currentSector)
        const sectorsToPopulate = this._getEmptySectorsToPopulate(neighbourSectors)
        const sectorsToDispose = this._getPopulatedSectorsToDispose(neighbourSectors, currentSector)

        this.disposeSectors(sectorsToDispose)
        this._populateSectorsWithRandomPopulation(sectorsToPopulate)
    }

    getSectorsStatus(currentSector) {
        const sectorsNeighbour = this.getNeighbourSectors(currentSector)
        const sectorsToPopulate = this._getEmptySectorsToPopulate(sectorsNeighbour)
        const sectorsToDispose = this._getPopulatedSectorsToDispose(sectorsNeighbour, currentSector)

        return {
            sectorsNeighbour,
            sectorsToPopulate,
            sectorsToDispose
        }
    }

    getNeighbourSectors(currentSector) {
        const neighbourSectors = [currentSector]
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
        for (let sectorToDispose of sectorsToDispose) {
            let objectToDispose = this.activeSectors.get(sectorToDispose)
            
            objectToDispose.dispose()
            objectToDispose = null

            this.activeSectors.delete(sectorToDispose)
        }

    }

    _getEmptySectorsToPopulate(neighbourSectors) {
        const emptySectorsToPopulate = []

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
}