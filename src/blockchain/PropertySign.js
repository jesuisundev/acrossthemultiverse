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
                age: 'Child | ~1T year (40%)',
                diversity: 'High (10%)',
                singularity: 'Magnetar (5%)',
                dominantRace: 'Human (60%)'
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
        console.log(this.text.metadata,'this.text.metadata')
        const text = `
            Universe : #${window.currentUniverse.universeNumber}
            Owner : ${this.text.owner}

            Type : ${this.text.metadata.type}
            Age : ${this.text.metadata.age}
            Diversity : ${this.text.metadata.diversity}
            Singularity : ${this.text.metadata.singularity}
            Dominant Race : ${this.text.metadata.dominantRace}
        `

        this.propertySignGeometry = new THREE.TextGeometry(text, {
            font: this.font,
            size: 2000,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 0
        })
        this.propertySignMaterial = new THREE.MeshBasicMaterial({ color: this._getTextColor(), side: THREE.BackSide })
        this.propertySignMesh = new THREE.Mesh(this.propertySignGeometry, this.propertySignMaterial)

        this.propertySignMesh.position.set(-22000, 10000, -40000)
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
            type: window.currentUniverse.universeModifiers.type.displayName,
            age: window.currentUniverse.universeModifiers.age.displayName,
            diversity: window.currentUniverse.universeModifiers.diversity.displayName,
            singularity: window.currentUniverse.universeModifiers.singularity.displayName,
            dominantRace: window.currentUniverse.universeModifiers.dominantRace.displayName
        }
    }

    _getTextColor() {
        let color = 0xFFFFFF

        switch (window.currentUniverse.universeModifiers.type.id) {
            case 'eternal':
                color = 0x000000
        }

        return color
    }

    _getOwner() {
        // todo: from the blockchain
    }

    _getUniverseMetadata() {
        // todo: from the blockchain (from universe class - from url/hash)
    }
}