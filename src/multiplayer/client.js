import geckos from '@geckos.io/client'

export default class MultiplayerClient {
  constructor () {
    this.initialize()
  }

  initialize () {
    this.channel = geckos({ port: 3000 })

    this.channel.onConnect(error => {
      if (error) {
        console.error(error.message)
        return
      }

      this.channel.on('chat message', data => {
        console.log(`You got the message ${data}`)
      })

      this.channel.emit('chat message', 'a short message sent to the server')
    })
  }
}
