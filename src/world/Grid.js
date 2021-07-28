export default class Grid {
    constructor(camera, parameters) {
        this.camera = camera
        this.parameters = parameters.grid
        this.activeClusters = new Map()
        this.queueClusters = new Map()
    }

    getCurrentClusterPosition() {
        const currentCameraPosition = this.getCurrentCameraPosition()
        const xCoordinate = Math.trunc(currentCameraPosition.x / this.parameters.clusterSize)
        const yCoordinate = Math.trunc(currentCameraPosition.y / this.parameters.clusterSize)
        const zCoordinate = Math.trunc(currentCameraPosition.z / this.parameters.clusterSize)
        const currentClusterPosition = `${xCoordinate},${yCoordinate},${zCoordinate}`

        return currentClusterPosition
    }

    getCurrentCameraPosition() {
        this.camera.updateMatrixWorld()

        return this.camera.position
    }

    getClustersStatus(currentCluster) {
        const clustersNeighbour = this.getNeighbourClusters(currentCluster)
        const clustersToPopulate = this._getEmptyClustersToPopulate(clustersNeighbour)
        const clustersToDispose = this._getPopulatedClustersToDispose(clustersNeighbour, currentCluster)

        return {
            clustersNeighbour,
            clustersToPopulate,
            clustersToDispose
        }
    }

    getNeighbourClusters(currentCluster) {
        const neighbourClusters = [currentCluster]
        const currentClusterArray = currentCluster.split(',')
        const x = currentClusterArray[0]
        const y = currentClusterArray[1]
        const z = currentClusterArray[2]

        // forward
        neighbourClusters.push(
            `${x},${y},${Number(z) - 1}`
        )

        // backward
        neighbourClusters.push(
            `${x},${y},${Number(z) + 1}`
        )

        // right
        neighbourClusters.push(
            `${Number(x) + 1},${y},${z}`
        )

        // left
        neighbourClusters.push(
            `${Number(x) - 1},${y},${z}`
        )

        // forward right
        neighbourClusters.push(
            `${Number(x) + 1},${y},${Number(z) - 1}`
        )

        // forward left
        neighbourClusters.push(
            `${Number(x) - 1},${y},${Number(z) - 1}`
        )

        // backward right
        neighbourClusters.push(
            `${Number(x) + 1},${y},${Number(z) + 1}`
        )

        // backward left
        neighbourClusters.push(
            `${Number(x) - 1},${y},${Number(z) + 1}`
        )

        return neighbourClusters
    }

    disposeClusters(clustersToDispose) {
        for (let clusterToDispose of clustersToDispose) {
            let matter = this.activeClusters.get(clusterToDispose)

            matter.dispose()
            matter = null

            this.activeClusters.delete(clusterToDispose)
        }
    }

    addMattersToClustersQueue(matters, type = 'starfield', subtype = null) {
        for (let clusterToPopulate of Object.keys(matters)) {
            this.queueClusters.set(clusterToPopulate, {
                type: type,
                subtype: subtype,
                data: matters[clusterToPopulate]
            })
        }
    }

    _getEmptyClustersToPopulate(neighbourClusters) {
        const emptyClustersToPopulate = []

        for (let neighbourCluster of neighbourClusters) {
            if (!this.activeClusters.has(neighbourCluster))
                emptyClustersToPopulate.push(neighbourCluster)
        }

        return emptyClustersToPopulate
    }

    _getPopulatedClustersToDispose(neighbourClusters, currentCluster) {
        const populatedClustersToDispose = []

        for (let activeClusterKey of this.activeClusters.keys()) {
            if (currentCluster != activeClusterKey && !neighbourClusters.includes(activeClusterKey))
                populatedClustersToDispose.push(activeClusterKey)
        }

        return populatedClustersToDispose
    }
}