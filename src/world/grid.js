export default class Grid {
    // should i use octree for this ?
    // first we're stick with hashmap and well change later if needed
    constructor() {
        console.log('GRID')

        // create neighboord starfie
    }

    static getCurrentSectorPosition(currentCameraPosition, gridSectorSize) {
        const gridChunk = gridSectorSize / 2
        let xSector, ySector, zSector

        xSector = Math.trunc(currentCameraPosition.x / gridChunk)
        ySector = Math.trunc(currentCameraPosition.y / gridChunk)
        zSector = Math.trunc(currentCameraPosition.z / gridChunk)

        const currentSectorPosition = `${xSector},${ySector},${zSector}`

        return currentSectorPosition
    }
}