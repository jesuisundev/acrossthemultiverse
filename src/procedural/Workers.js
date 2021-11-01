export default class Workers {
  constructor (grid) {
    /**
    * Web worker used for heavy work on background. Critical to not block the event loop.
    */
    if (!window.Worker) {
      throw new Error('You browser is shit. Do something about it.')
    }

    this.grid = grid
    this.workersDistribution = []

    this._setWorkers()
    this._setWorkersListener()
    this._setWorkersDistribution()
  }

  _setWorkers () {
    this.openStarfieldWorker = {
      type: 'Starfield',
      subtype: 'Open',
      source: new Worker(new URL('./starfield/OpenStarfieldWorker.js', import.meta.url))
    }

    this.globularStarfieldWorker = {
      type: 'Starfield',
      subtype: 'Globular',
      source: new Worker(new URL('./starfield/GlobularStarfieldWorker.js', import.meta.url))
    }

    this.emissionNebulaWorker = {
      type: 'Nebula',
      subtype: 'Emission',
      source: new Worker(new URL('./nebula/EmissionNebulaWorker.js', import.meta.url))
    }

    this.supernovaRemnantsNebulaWorker = {
      type: 'Nebula',
      subtype: 'Remnant',
      source: new Worker(new URL('./nebula/SupernovaRemnantsNebulaWorker.js', import.meta.url))
    }

    this.spiralGalaxyWorker = {
      type: 'Galaxy',
      subtype: 'Spiral',
      source: new Worker(new URL('./galaxy/SpiralGalaxyWorker.js', import.meta.url))
    }

    this.sombreroGalaxyWorker = {
      type: 'Galaxy',
      subtype: 'Sombrero',
      source: new Worker(new URL('./galaxy/SombreroGalaxyWorker.js', import.meta.url))
    }

    this.irregularGalaxyWorker = {
      type: 'Galaxy',
      subtype: 'Irregular',
      source: new Worker(new URL('./galaxy/IrregularGalaxyWorker.js', import.meta.url))
    }

    this.sunGiantWorker = {
      type: 'Giant',
      subtype: 'Sun',
      source: new Worker(new URL('./giant/SunGiantWorker.js', import.meta.url))
    }

    this.whiteDwarfGiantWorker = {
      type: 'Giant',
      subtype: 'WhiteDwarf',
      source: new Worker(new URL('./giant/WhiteDwarfGiantWorker.js', import.meta.url))
    }

    this.starGiantWorker = {
      type: 'Giant',
      subtype: 'Star',
      source: new Worker(new URL('./giant/StarGiantWorker.js', import.meta.url))
    }

    this.blackholeWorker = {
      type: 'Singularity',
      subtype: 'Blackhole',
      source: new Worker(new URL('./singularity/BlackHoleSingularityWorker.js', import.meta.url))
    }

    this.spaceshipNormandyWorker = {
      type: 'Spaceship',
      subtype: 'Normandy',
      source: new Worker(new URL('./spaceship/SpaceshipWorker.js', import.meta.url))
    }

    this.spaceshipStationWorker = {
      type: 'Spaceship',
      subtype: 'Station',
      source: new Worker(new URL('./spaceship/SpaceshipWorker.js', import.meta.url))
    }
  }

  _setWorkersListener () {
    this.openStarfieldWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'starfield',
      'open'
    )

    this.globularStarfieldWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'starfield',
      'globular'
    )

    this.emissionNebulaWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'nebula',
      'emission'
    )

    this.supernovaRemnantsNebulaWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'nebula',
      'remnant'
    )

    this.spiralGalaxyWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'galaxy',
      'spiral'
    )

    this.sombreroGalaxyWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'galaxy',
      'sombrero'
    )

    this.irregularGalaxyWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'galaxy',
      'irregular'
    )

    this.sunGiantWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'giant',
      'sun'
    )

    this.whiteDwarfGiantWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'giant',
      'whitedwarf'
    )

    this.starGiantWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'giant',
      'star'
    )

    this.blackholeWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'singularity',
      'blackhole'
    )

    this.spaceshipNormandyWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'spaceship',
      'normandy'
    )

    this.spaceshipStationWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'spaceship',
      'station'
    )
  }

  _setWorkersDistribution () {
    this.workersDistribution[0] = [
      {
        chances: 20,
        worker: this.openStarfieldWorker
      },
      {
        chances: 13,
        worker: this.emissionNebulaWorker
      },
      {
        chances: 12,
        worker: this.irregularGalaxyWorker
      },
      {
        chances: 11,
        worker: this.globularStarfieldWorker
      },
      {
        chances: 10,
        worker: this.spiralGalaxyWorker
      },
      {
        chances: 9,
        worker: this.sombreroGalaxyWorker
      },
      {
        chances: 8,
        worker: this.supernovaRemnantsNebulaWorker
      },
      {
        chances: 4,
        worker: this.blackholeWorker
      },
      {
        chances: 3,
        worker: this.starGiantWorker
      },
      {
        chances: 2,
        worker: this.sunGiantWorker
      },
      {
        chances: 1.5,
        worker: this.spaceshipNormandyWorker
      },
      {
        chances: 1,
        worker: this.whiteDwarfGiantWorker
      },
      {
        chances: 0.5,
        worker: this.spaceshipStationWorker
      }
    ]

    this.workersDistribution[1] = [
      {
        chances: 38,
        worker: this.globularStarfieldWorker
      },
      {
        chances: 38,
        worker: this.emissionNebulaWorker
      },
      {
        chances: 10,
        worker: this.openStarfieldWorker
      },
      {
        chances: 8,
        worker: this.supernovaRemnantsNebulaWorker
      },
      {
        chances: 5,
        worker: this.blackholeWorker
      }
    ]

    this.workersDistribution[2] = [
      {
        chances: 90,
        worker: this.spiralGalaxyWorker
      },
      {
        chances: 10,
        worker: this.blackholeWorker
      }
    ]

    this.workersDistribution[3] = [
      {
        chances: 90,
        worker: this.openStarfieldWorker
      },
      {
        chances: 10,
        worker: this.blackholeWorker
      }
    ]

    this.workersDistribution[4] = [
      {
        chances: 100,
        worker: this.openStarfieldWorker
      }
    ]
  }

  getWorkerDistributed (clusterToPopulate) {
    if (clusterToPopulate === '0,0,0') {
      return this.openStarfieldWorker.source
    }

    let currentProbability = 0
    const pourcentage = Math.random() * 100

    for (const workerDistributed of this.workersDistribution[window.currentUniverse]) {
      currentProbability += workerDistributed.chances

      if (pourcentage < currentProbability) {
        if (!this.isClusterEligibleForSpecialEvent(clusterToPopulate, workerDistributed))
          return this.openStarfieldWorker.source

        return workerDistributed.worker.source
      }
    }
  }

  isClusterEligibleForSpecialEvent(clusterToPopulate, workerDistributed) {
    if((workerDistributed.worker.subtype != 'Blackhole') && workerDistributed.worker.type != 'Spaceship' && workerDistributed.worker.type != 'Giant')
       return true

    const coordinates = clusterToPopulate.split(',')

    for(let coordinate of coordinates) {
      coordinate = Number(coordinate)

      if(coordinate > 2 || coordinate < -2) {
        return true
      }
    }

    return false
  }
}
