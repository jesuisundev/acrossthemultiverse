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
            Universe : #${this.text.universeNumber}
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
        const metadata = {
            type: 'Unknow',
            astralDiversity: 'Unknow',
            astralSingularity: 'Unknow'
        }

        switch(window.currentUniverse) {
            case 0:
                metadata.type = 'Borealis (60%)'
                metadata.astralDiversity = 'High (10%)'
                metadata.astralSingularity = 'Magnetar (5%)'
                break
            case 1:
                metadata.type = 'Bloom (20%)'
                metadata.astralDiversity = 'Very High (2%)'
                metadata.astralSingularity = 'Black Hole (80%)'
                break
            case 2:
                metadata.type = 'Filament (18%)'
                metadata.astralDiversity = 'Normal (70%)'
                metadata.astralSingularity = 'Blazar (25%)'
                break
            case 3:
                metadata.type = 'Ethereum (2%)'
                metadata.astralDiversity = 'Very High (2%)'
                metadata.astralSingularity = 'Pulsar (2%)'
                break
        }

        return metadata
    }

    _getOwner() {
        // todo: from the blockchain
    }

    _getUniverseMetadata() {
        // todo: from the blockchain (from universe class - from url/hash)
    }
}