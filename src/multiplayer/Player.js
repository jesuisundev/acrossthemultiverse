import * as THREE from 'three'
import { FontLoader } from 'three/src/loaders/FontLoader'

export default class Player {
  constructor (camera, scene, library) {
    this.camera = camera
    this.scene = scene
    this.library = library

    this.fontLoader = new FontLoader()
    this.fontLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json',
      font => { this.font = font}
    )
  }

  async getNewPlayerModel() {
    const playerModelGeometry = new THREE.SphereGeometry(500, 500, 500)
    const playerModelMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: false})
    const playerModelMesh = this.library.player.model.clone()

    return { playerModelGeometry, playerModelMaterial, playerModelMesh }
  }

  async getNewPlayerName(name=null) {
    const playerNameFont = this.font
    const playerNameText = name ? name : (Math.random() + 1).toString(36).substring(2)

    const playerNameGeometry = new THREE.TextGeometry(playerNameText, {
      font: playerNameFont,
      size: 100,
      height: 10,
      curveSegments: 10,
      bevelEnabled: false
    })

    const playerNameMaterial = new THREE.MeshBasicMaterial({color: 0xffffff})
    const playerNameMesh = new THREE.Mesh(playerNameGeometry, playerNameMaterial)

    return { playerNameGeometry, playerNameMaterial, playerNameMesh }
  }
}
