import MultiverseFactory from '../procedural/MultiverseFactory'
import Workers from '../procedural/Workers'

export default class Grid {
  constructor (camera, parameters, scene, library) {
    this.camera = camera
    this.parameters = parameters
    this.scene = scene
    this.library = library
    this.activeClusters = new Map()
    this.queueClusters = new Map()

    this.multiverseFactory = new MultiverseFactory(this.scene, this.library, this.parameters)
    this.workers = new Workers(this)
  }

  getCurrentClusterPosition () {
    const currentCameraPosition = this.getCurrentCameraPosition()
    const xCoordinate = Math.trunc(currentCameraPosition.x / this.parameters.grid.clusterSize)
    const yCoordinate = Math.trunc(currentCameraPosition.y / this.parameters.grid.clusterSize)
    const zCoordinate = Math.trunc(currentCameraPosition.z / this.parameters.grid.clusterSize)
    const currentClusterPosition = `${xCoordinate},${yCoordinate},${zCoordinate}`

    return currentClusterPosition
  }

  getCurrentCameraPosition () {
    this.camera.updateMatrixWorld()

    return this.camera.position
  }

  getClustersStatus (currentCluster) {
    const clustersNeighbour = this.getNeighbourClusters(currentCluster)
    const clustersToPopulate = this._getEmptyClustersToPopulate(clustersNeighbour)
    const clustersToDispose = this._getPopulatedClustersToDispose(clustersNeighbour, currentCluster)

    return {
      clustersNeighbour,
      clustersToPopulate,
      clustersToDispose
    }
  }

  getNeighbourClusters (currentCluster) {
    const neighbourClusters = [currentCluster]
    const currentClusterArray = currentCluster.split(',')
    const x = currentClusterArray[0]
    const y = currentClusterArray[1]
    const z = currentClusterArray[2]

    // forward
    neighbourClusters.push(`${x},${y},${Number(z) - 1}`)

    // backward
    neighbourClusters.push(`${x},${y},${Number(z) + 1}`)

    // right
    neighbourClusters.push(`${Number(x) + 1},${y},${z}`)

    // left
    neighbourClusters.push(`${Number(x) - 1},${y},${z}`)

    // forward right
    neighbourClusters.push(`${Number(x) + 1},${y},${Number(z) - 1}`)

    // forward left
    neighbourClusters.push(`${Number(x) - 1},${y},${Number(z) - 1}`)

    // backward right
    neighbourClusters.push(`${Number(x) + 1},${y},${Number(z) + 1}`)

    // backward left
    neighbourClusters.push(`${Number(x) - 1},${y},${Number(z) + 1}`)

    return neighbourClusters
  }

  disposeClusters (clustersToDispose) {
    for (const clusterToDispose of clustersToDispose) {
      let matter = this.activeClusters.get(clusterToDispose)

      matter.dispose()
      matter = null

      this.activeClusters.delete(clusterToDispose)
    }
  }

  addMattersToClustersQueue (matters, type = 'starfield', subtype = null) {
    for (const clusterToPopulate of Object.keys(matters)) {
      this.queueClusters.set(clusterToPopulate, {
        type: type,
        subtype: subtype,
        data: matters[clusterToPopulate]
      })
    }
  }

  populateNewUniverse () {
    const clusterStatus = this.getClustersStatus('0,0,0')
    this.workers = new Workers(this)
    this.buildMatters(clusterStatus.clustersToPopulate)
  }

  buildMatters (clustersToPopulate) {
    for (const clusterToPopulate of clustersToPopulate) {
      let randomDistributedWorker = this.workers.getWorkerDistributed(clusterToPopulate)
      if (!randomDistributedWorker) {
        // TODO - why the fuck this happen, fix it
        randomDistributedWorker = this.workers.openStarfieldWorker.source
      }

      randomDistributedWorker.postMessage({
        clustersToPopulate: [clusterToPopulate],
        parameters: this.parameters,
        currentUniverse: window.currentUniverse
      })
    }
  }

  renderMatters (position, cluster) {
    const matter = this.multiverseFactory.createMatter(cluster.type)
  
    matter.generate(cluster.data, position, cluster.subtype)
    matter.show()
  
    this.queueClusters.delete(position)
    this.activeClusters.set(position, matter)
  }

  _getEmptyClustersToPopulate (neighbourClusters) {
    const emptyClustersToPopulate = []

    for (const neighbourCluster of neighbourClusters) {
      if (!this.activeClusters.has(neighbourCluster)) {
        emptyClustersToPopulate.push(neighbourCluster)
      }
    }

    return emptyClustersToPopulate
  }

  _getPopulatedClustersToDispose (neighbourClusters, currentCluster) {
    const populatedClustersToDispose = []

    for (const activeClusterKey of this.activeClusters.keys()) {
      if (currentCluster !== activeClusterKey && !neighbourClusters.includes(activeClusterKey)) {
        populatedClustersToDispose.push(activeClusterKey)
      }
    }

    return populatedClustersToDispose
  }
}
