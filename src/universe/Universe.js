

export default class Universe {
    constructor (parameters, universeNumber) {
        this.parameters = parameters

        this.isReady = false
        this.universeNumber = this._getSanitizedUniverseNumber(universeNumber)
        this.universeModifiers = {}
        this.matters = {}
    }

    async generateMatters() {
        this.matters = this.parameters.defaultMatters

        await this._setUniverseModifiers()
        await this._applyUniverseModifiersToMatters()

        this.isReady = true
    }

    async generateRandomMatters() {
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

    async _applyTypeUniverseModifier() {
    }

    async _applyAgeUniverseModifier() {
    }

    async _applyDiversityUniverseModifier() {
    }

    async _applySinguralityUniverseModifier() {
    }

    async _applyDominantRaceUniverseModifier() {
    }
}