import geckos from '@geckos.io/client'
import Player from './Player'

export default class Multiplayer {
  constructor (camera, scene, library, propertySign, enable = false) {
    this.camera = camera
    this.scene = scene
    this.library = library

    this.server = {
      //url: "https://195-154-113-94.rev.poneytelecom.eu",
      url: "http://192.168.2.138",
      port: 3000
    }

    this.propertySign = propertySign
    this.playerBuilder = new Player(camera, scene, library)
    this.players = []
    this.channel = {}
    this.isConnected = false
    this.isEnable = enable

    this.showPlayer = true
    this.showOtherPlayers = true
  }

  async connect () {
    this.channel = geckos({ url: this.server.url, port: this.server.port })

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

      // TODO: fix bug surimpression
      //this.propertySign.addPropertySign()
    })
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

  hideMultiplayer() {
    this.showPlayer = false
    this.showOtherPlayers = false
  }

  showMultiplayer() {
    this.showPlayer = true
    this.showOtherPlayers = true
  }

  _getPlayerData () {
    return {
      id: this.channel.id,
      xPosition: this.camera.position.x,
      yPosition: this.camera.position.y,
      zPosition: this.camera.position.z,
      xRotation: this.camera.rotation.x,
      yRotation: this.camera.rotation.y,
      zRotation: this.camera.rotation.z,
      showPlayer: this.showPlayer,
      universePlayer: window.currentUniverse.universeNumber
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

    if(!this.showOtherPlayers) {
      this._hideAllPlayers()
      return
    }

    if(!data.showPlayer || window.currentUniverse.universeNumber ==! data.universePlayer) {
      playerToUpdate.playerModel.playerModelMesh.visible = false
      playerToUpdate.playerName.playerNameMesh.visible = false
      return
    }

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

    playerToUpdate.playerModel.playerModelMesh.visible = true
    playerToUpdate.playerName.playerNameMesh.visible = true
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
    this.scene.remove(playerDisconnected.playerName.playerNameMesh)
  }

  _hideAllPlayers () {
    this.players.forEach(player => {
      player.playerModel.playerModelMesh.visible = false
      player.playerName.playerNameMesh.visible = false
    })
  }
}
