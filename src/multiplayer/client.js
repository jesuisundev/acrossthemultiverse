import * as THREE from 'three'
import geckos from '@geckos.io/client'

export default class MultiplayerClient {
  constructor (camera, scene, enable = false) {
    this.camera = camera
    this.scene = scene
    this.players = []

    this.isConnected = false
    this.isEnable = enable

    this._initialize()
  }

  isReady () {
    return this.isConnected && this.isEnable
  }

  update () {
    if (!this.isReady())
      return

    this.channel.emit('onPlayerUpdate', this._getPlayerData())
  }
  
  render () {
    if (!this.isReady())
      return

    this.channel.emit('onPlayerRender', this._getPlayerData())
  }

  getPlayerById (id) {
    return this.players.find(player => player.id === id)
  }

  _initialize () {
    this.channel = geckos({ port: 3000 })

    this.channel.onConnect(error => {
      if (error) {
        console.error(error.message)
        return
      }

      this.isConnected = true

      this.channel.emit('onPlayerConnect', this._getPlayerData())

      this.channel.on('onPlayerConnect', data => this._onPlayerConnect(data))
      this.channel.on('onPlayerUpdate', data => this._onPlayerUpdate(data))
      this.channel.on('onPlayerDisconnect', id => this._onPlayerDisconnect(id))
    })
  }

  _getPlayerData () {
    return {
      id: this.channel.id,
      xPosition: this.camera.position.x,
      yPosition: this.camera.position.y,
      zPosition: this.camera.position.z,
      xRotation: this.camera.rotation.x,
      yRotation: this.camera.rotation.y,
      zRotation: this.camera.rotation.z
    }
  }

  _onPlayerConnect (data) {
    if(!data || this.channel.id === data.id)
      return

    this._addPlayer(data)
  }

  _addPlayer(data) {
    const playerModel = this._createPlayerModel()
    this.scene.add(playerModel.mesh)
    this.players.push({
      id: data.id, 
      playerModel: playerModel
    })
  }

  _createPlayerModel() {
    const geometry = new THREE.BoxGeometry(500, 500, 500)
    const material = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: false})

    return {
      geometry: geometry,
      material: material,
      mesh: new THREE.Mesh(geometry, material)
    }
  }

  _onPlayerUpdate(data) {
    if(!data || this.channel.id === data.id)
      return

    let playerToUpdate = this.getPlayerById(data.id)

    if (!playerToUpdate) {
      this._addPlayer(data)
      playerToUpdate = this.getPlayerById(data.id)
    }

    playerToUpdate.playerModel.mesh.position.set(data.xPosition, data.yPosition, data.zPosition)
    playerToUpdate.playerModel.mesh.rotation.set(data.xRotation, data.yRotation, data.zRotation)
  }

  _onPlayerDisconnect (id) {
    const playerDisconnected = this.players.find(player => player.id === id)

    if (!playerDisconnected)
      return

    this._disposePlayerModel(playerDisconnected)

    this.players = this.players.filter(player => player.id !== id)
  }

  _disposePlayerModel (playerDisconnected) {
    if (!playerDisconnected) {
      console.log('Can\'t dispose empty player')
      return
    }

    playerDisconnected.playerModel.geometry.dispose()
    playerDisconnected.playerModel.material.dispose()
    this.scene.remove(playerDisconnected.playerModel.mesh)
  }
}
