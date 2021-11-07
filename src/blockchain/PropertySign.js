import * as THREE from 'three'
import { FontLoader } from 'three/src/loaders/FontLoader'

export default class PropertySign {
    constructor(camera, scene) {
        this.camera = camera
        this.scene = scene

        this.text = {
            universeNumber: '0001',
            owner: 'vooodoo.eth',
            metadata: {
                type: 'Borealis (60%)',
                astralDiversity: 'High (10%)',
                astralSingularity: 'Magnetar (5%)'
            }
        }
        this.fontLoader = new FontLoader()
        this.fontLoader.load(
            'fonts/optimer_regular.typeface.json',
            font => { this.font = font}
        )
    }

    addPropertySign() {
        this.text.metadata = this._getLocalUniverseMetadata()
        const text = `
            Universe : #${window.currentUniverse.universeNumber}
            Owner : ${this.text.owner}

            Type : ${this.text.metadata.type}
            Astral Diversity : ${this.text.metadata.astralDiversity}
            Astral Singularity : ${this.text.metadata.astralSingularity}
        `

        this.propertySignGeometry = new THREE.TextGeometry(text, {
            font: this.font,
            size: 2000,
            height: 10,
            curveSegments: 15,
            bevelEnabled: true
        })
        this.propertySignMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
        this.propertySignMesh = new THREE.Mesh(this.propertySignGeometry, this.propertySignMaterial)

        this.propertySignMesh.position.set(-22000, 10000, -25000)
        this.scene.add(this.propertySignMesh)
    }

    dispose() {
        this.propertySignGeometry.dispose()
        this.propertySignMaterial.dispose()
        this.scene.remove(this.propertySignMesh)
    }

    _getLocalUniverseMetadata() {
        if(!window.currentUniverse.isReady)
            return {}

        return {
            type: window.currentUniverse.universeModifiers.type,
            age: window.currentUniverse.universeModifiers.age,
            diversity: window.currentUniverse.universeModifiers.diversity,
            singularity: window.currentUniverse.universeModifiers.singularity,
            dominantRace: window.currentUniverse.universeModifiers.dominantRace
        }
    }

    _getOwner() {
        // todo: from the blockchain
    }

    _getUniverseMetadata() {
        // todo: from the blockchain (from universe class - from url/hash)
    }
}