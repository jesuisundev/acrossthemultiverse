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
            'fonts/Roboto_Regular.json',
            font => { this.font = font}
        )
    }

    addPropertySign() {
        this.text.metadata = this._getLocalUniverseMetadata()

        const textOwner = `
            Universe : #${window.currentUniverse.universeNumber}
            Owner : ${this.text.owner}
        `

        const textDescription = `
            Type : ${this.text.metadata.type}
            Age : ${this.text.metadata.age}
            Diversity : ${this.text.metadata.diversity}
            Singularity : ${this.text.metadata.singularity}
            Dominant Race : ${this.text.metadata.dominantRace}
        `

        this.propertySignGeometryOwner = new THREE.TextGeometry(textOwner, {
            font: this.font,
            size: 1000,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 0
        })
        this.propertySignMaterialOwner = new THREE.MeshBasicMaterial({ color: this._getTextColor(), side: THREE.BackSide })
        this.propertySignMeshOwner = new THREE.Mesh(this.propertySignGeometryOwner, this.propertySignMaterialOwner)

        this.propertySignGeometryDescription = new THREE.TextGeometry(textDescription, {
            font: this.font,
            size: 500,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 0
        })
        this.propertySignMaterialDescription = new THREE.MeshBasicMaterial({ color: this._getTextColor(), side: THREE.BackSide })
        this.propertySignMeshDescription = new THREE.Mesh(this.propertySignGeometryDescription, this.propertySignMaterialDescription)

        this.propertySignMeshOwner.position.set(-8000, 5000, -31000)
        this.propertySignMeshDescription.position.set(-5900, 500, -31000)
        this.scene.add(this.propertySignMeshOwner, this.propertySignMeshDescription)
    }

    dispose() {
        this.propertySignGeometryOwner.dispose()
        this.propertySignMaterialOwner.dispose()

        this.propertySignGeometryDescription.dispose()
        this.propertySignMaterialDescription.dispose()
        this.scene.remove(this.propertySignMeshOwner, this.propertySignMeshDescription)
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