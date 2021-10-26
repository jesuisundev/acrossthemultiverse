import * as THREE from 'three'
import geckos from '@geckos.io/client'
import { FontLoader } from 'three/src/loaders/FontLoader'
import Player from './Player'

export default class Multiplayer {
  constructor (camera, scene, enable = false) {
    this.camera = camera
    this.scene = scene
    this.players = []
    this.playerBuilder = new Player(camera, scene)
    this.channel = {}
    this.loader = new FontLoader()

    this.isConnected = false
    this.isEnable = enable
  }

  isReady () {
    return this.isConnected && this.isEnable
  }

  update () {
    if (!this.isReady())
      return

    this.channel.emit('onPlayerUpdate', this._getPlayerData())
  }

  getPlayerById (id) {
    return this.players.find(player => player.id === id)
  }

  async connect () {
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

  async _onPlayerConnect (data) {
    if(!data || this.channel.id === data.id)
      return

    await this._addPlayer(data)
  }

  async _addPlayer(data) {
    const playerModel = await this.playerBuilder.getNewPlayerModel()
    const playerName = await this.playerBuilder.getNewPlayerName(data.id)

    this.scene.add(playerName.playerNameMesh)
    this.scene.add(playerModel.playerModelMesh)

    this.players.push({
      id: data.id, 
      playerModel: playerModel,
      playerName: playerName
    })
  }

  _onPlayerUpdate(data) {
    if(!data || this.channel.id === data.id)
      return

    let playerToUpdate = this.getPlayerById(data.id)

    if (!playerToUpdate) {
      this._addPlayer(data)
      playerToUpdate = this.getPlayerById(data.id)
    }

    if (!playerToUpdate)
      return

    playerToUpdate.playerModel.playerModelMesh.position.set(data.xPosition, data.yPosition, data.zPosition)
    playerToUpdate.playerModel.playerModelMesh.rotation.set(data.xRotation, data.yRotation, data.zRotation)
    playerToUpdate.playerName.playerNameMesh.lookAt(this.camera.position)
    playerToUpdate.playerName.playerNameGeometry.center()

    playerToUpdate.playerName.playerNameMesh.position.set(
      data.xPosition,
      data.yPosition + 650,
      data.zPosition
    )
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

    playerDisconnected.playerModel.playerModelGeometry.dispose()
    playerDisconnected.playerModel.playerModelMaterial.dispose()

    playerDisconnected.playerName.playerNameGeometry.dispose()
    playerDisconnected.playerName.playerNameMaterial.dispose()

    this.scene.remove(playerDisconnected.playerModel.playerModelMesh)
  }
}
