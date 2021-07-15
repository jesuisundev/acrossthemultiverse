import StarField from '../procedural/starfield/Starfield'

export default class Grid {
    constructor() {
        this.activeSectors = new Map()
        this.queueSectors = new Map()

        this.parameters = {
            sectorSize: 2200
        }
    }

    getCurrentSectorPosition(currentCameraPosition) {
        const gridChunk = this.parameters.sectorSize
        const xCoordinate = Math.trunc(currentCameraPosition.x / gridChunk)
        const yCoordinate = Math.trunc(currentCameraPosition.y / gridChunk)
        const zCoordinate = Math.trunc(currentCameraPosition.z / gridChunk)
        const currentSectorPosition = `${xCoordinate},${yCoordinate},${zCoordinate}`

        return currentSectorPosition
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
            let matter = this.activeSectors.get(sectorToDispose)

            matter.dispose()
            matter = null

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