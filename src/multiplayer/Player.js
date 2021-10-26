import * as THREE from 'three'
import { FontLoader } from 'three/src/loaders/FontLoader'

export default class Player {
  constructor (camera, scene, library, parameters, multiplayer) {
    this.camera = camera
    this.scene = scene
    this.library = library
    this.parameters = parameters
    this.multiplayer = this.multiplayer

    this.fontLoader = new FontLoader()
    this.fontLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json',
      font => { this.font = font}
    )
  }

  async getNewPlayerModel() {
    const playerModelGeometry = new THREE.SphereGeometry(500, 500, 500)
    const playerModelMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: false})

    return {
      playerModelGeometry: playerModelGeometry,
      playerModelMaterial: playerModelMaterial,
      playerModelMesh: new THREE.Mesh(playerModelGeometry, playerModelMaterial)
    }
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

    return {
      playerNameGeometry: playerNameGeometry,
      playerNameMaterial: playerNameMaterial,
      playerNameMesh: new THREE.Mesh(playerNameGeometry, playerNameMaterial)
    }
  }

  async _setLocalPlayer() {
    await this._setLocalPlayerModel()
    await this._setLocalPlayerName()

    this.localPlayerModelMesh.add(this.localPlayerNameMesh)
    this.camera.add(this.localPlayerModelMesh)
  }

  async _setLocalPlayerModel() {
    const localPlayerModel = await this.getNewPlayerModel()

    this.localPlayerModelGeometry = localPlayerModel.playerModelGeometry
    this.localPlayerModelMaterial = localPlayerModel.playerModelMaterial
    this.localPlayerModelMesh = localPlayerModel.playerModelMesh
  }

  async _setLocalPlayerName() {
    const localPlayerName = await this.getNewPlayerName()

    this.localPlayerNameGeometry = localPlayerName.playerNameGeometry
    this.localPlayerNameMaterial = localPlayerName.playerNameMaterial
    this.localPlayerNameMesh = localPlayerName.playerNameMesh
  }
}
