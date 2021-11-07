

export default class Universe {
    constructor (parameters, universeNumber) {
        this.parameters = parameters

        this.isReady = false
        this.universeNumber = this._getSanitizedUniverseNumber(universeNumber)
        this.owner = 'vooodoo.eth'
        this.matters = this.parameters.defaultMatters
        this.workersDistribution = this.parameters.defaultWorkersDistribution

        this.universeModifiers = {}
    }

    async generate() {
        await this._setUniverseModifiers()
        await this._applyUniverseModifiersToMatters()

        this.isReady = true
    }

    async generateRandom() {
    }

    _getSanitizedUniverseNumber(universeNumber) {
        if(!universeNumber) {
            this.universeNumber = 1
            return this.universeNumber
        }

        // TODO check if universeNumber is a number
        // TODO check if universeNumber is in range 1-10000

        return universeNumber
    }

    async _setUniverseModifiers() {
        this.universeModifiers = {
            type: this.parameters.universeProperties.type.stable,
            age: this.parameters.universeProperties.age.child,
            diversity: this.parameters.universeProperties.diversity.superExtreme,
            singularity: this.parameters.universeProperties.singularity.blackHole,
            dominantRace: this.parameters.universeProperties.dominantRace.human
        }

        // TODO : should not be a switch but an async call to a db/cache
        // horrific harcoded values for now
        switch (this.universeNumber) {
            default:
                return
        }
    }

    async _applyUniverseModifiersToMatters() {
        await this._applyTypeUniverseModifier()
        await this._applyAgeUniverseModifier()
        await this._applyDiversityUniverseModifier()
        await this._applySinguralityUniverseModifier()
        await this._applyDominantRaceUniverseModifier()
    }

    // Type modifiers

    async _applyTypeUniverseModifier() {
        switch (this.universeModifiers.type.id) {
            case 'bloom':
                this._applyBloomTypeUniverseModifier()
                break;
            
            case 'filaments':
                this._applyFilamentsTypeUniverseModifier()
                break;

            case 'ethereum':
                this._applyEthereumTypeUniverseModifier()
                break;

            case 'epiphany':
                this._applyEpiphanyTypeUniverseModifier()
                break;
        
            default:
                break;
        }
    }

    async _applyBloomTypeUniverseModifier() {
        // matters modifiers
        this.matters.global.bloomIntensity = 4
        this.matters.starfield.vertices.bright = { min: 0.001, max: 0.01 }
        this.matters.starfield.material.size.pass = { min: 70, max: 80 }

        this.matters.nebula.cloud = { min: 0.20, max: 0.30 }
        this.matters.nebula.bright = { min: 0.0002, max: 0.002 }
        this.matters.nebula.vertices.emission.radiusSegments = 100
        this.matters.nebula.colors.in = [
        '#0C8D9F',
        '#F9EF2E',
        '#08F7FE',
        '#09FBD3',
        '#FE53BB',
        '#F5D300',
        '#FFACFC',
        '#F148FB',
        '#FF2281',
        '#FDC7D7',
        '#E8E500',
        '#00FECA',
        '#FFD300',
        '#4DEEEA'
        ]

        this.matters.nebula.colors.out = [
        '#E847AE',
        '#13CA91',
        '#FF9472',
        '#FFDEF3',
        '#FF61BE',
        '#F85125',
        '#EBF875',
        '#28CF75',
        '#FE6B35',
        '#CE0000',
        '#7FFF00',
        '#E92EFB',
        '#74ee15'
        ]

        this.matters.nebula.remnantColors.in = this.matters.nebula.colors.in
        this.matters.nebula.remnantColors.out = this.matters.nebula.colors.out

        // workers modifiers
        this.workersDistribution = [
            {
                chances: 38,
                type: 'Starfield',
                subtype: 'Globular'
            },
            {
                chances: 38,
                type: 'Nebula',
                subtype: 'Emission'
            },
            {
                chances: 10,
                type: 'Starfield',
                subtype: 'Open'
            },
            {
                chances: 8,
                type: 'Nebula',
                subtype: 'Remnant'
            },
            {
                chances: 5,
                type: 'Singularity',
                subtype: 'Blackhole'
            }
        ]
    }

    async _applyFilamentsTypeUniverseModifier() {
        // matters modifiers
        this.matters.global.bloomIntensity = 4
        this.matters.galaxy.budget = 100000
        this.matters.galaxy.spiral.randomnessPower = 0.0002
        this.matters.galaxy.spiral.branchesAmplitude = 0.00008
        this.matters.galaxy.spiral.branches = { min: 300, max: 500 }
        this.matters.galaxy.material.size.pass = { min: 10, max: 20 }

        // workers modifiers
        this.workersDistribution = [
            {
                chances: 90,
                type: 'Galaxy',
                subtype: 'Spiral'
            },
            {
                chances: 10,
                type: 'Singularity',
                subtype: 'Blackhole'
            }
        ]
    }

    async _applyEthereumTypeUniverseModifier() {
        // matters modifiers
        this.matters.global.clearColor = '#000F34'
        this.matters.starfield.colors = this.matters.nebula.colors.in
        this.matters.starfield.globularColors = this.matters.nebula.colors.out
        this.matters.starfield.material.size.pass = { min: 130, max: 130 }

        // workers modifiers
        this.workersDistribution = [
            {
                chances: 90,
                type: 'Starfield',
                subtype: 'Open'
            },
            {
                chances: 10,
                type: 'Singularity',
                subtype: 'Blackhole'
            }
        ]
    }

    async _applyEpiphanyTypeUniverseModifier() {
        // workers modifiers
        this.workersDistribution = [
            {
                chances: 100,
                type: 'Starfield',
                subtype: 'Open'
            }
        ]
    }

    // Age modifiers

    async _applyAgeUniverseModifier() {
        // TODO
    }

    // Diversity modifiers

    async _applyDiversityUniverseModifier() {
    }

    // Singularity modifiers

    async _applySinguralityUniverseModifier() {
    }

    // Dominant race modifiers

    async _applyDominantRaceUniverseModifier() {
    }
}