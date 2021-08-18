export default class Workers {
  constructor (grid) {
    /**
    * Web worker used for heavy work on background. Critical to not block the event loop.
    */
    if (!window.Worker) {
      throw new Error('You browser is shit. Do something about it.')
    }

    this.grid = grid

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

    this.blackholeWorker = {
      type: 'Singularity',
      subtype: 'Blackhole',
      source: new Worker(new URL('./singularity/BlackHoleSingularityWorker.js', import.meta.url))
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

    this.blackholeWorker.source.onmessage = messageEvent => this.grid.addMattersToClustersQueue(
      messageEvent.data,
      'singularity',
      'blackhole'
    )
  }

  _setWorkersDistribution () {
    this.workersDistribution = [
      {
        chances: 30,
        worker: this.openStarfieldWorker
      },
      {
        chances: 20,
        worker: this.globularStarfieldWorker
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
        chances: 10,
        worker: this.spiralGalaxyWorker
      },
      {
        chances: 8,
        worker: this.supernovaRemnantsNebulaWorker
      },
      {
        chances: 4,
        worker: this.whiteDwarfGiantWorker
      },
      {
        chances: 2,
        worker: this.sunGiantWorker
      }
    ]
  }

  // {
  //   chances: 0, // this sould get updated to 1 after some time
  //   worker: this.blackholeWorker
  // }

  getWorkerDistributed (clusterToPopulate) {
    if (clusterToPopulate === '0,0,0') {
      return this.openStarfieldWorker.source
    }

    let currentProbability = 0
    const pourcentage = Math.random() * 100

    for (const workerDistributed of this.workersDistribution) {
      currentProbability += workerDistributed.chances

      if (pourcentage < currentProbability) {
        return workerDistributed.worker.source
      }
    }
  }
}
