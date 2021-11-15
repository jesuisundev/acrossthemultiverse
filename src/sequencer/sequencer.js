import * as THREE from 'three'
import { gsap } from 'gsap'

import Wormhole from './wormhole/Wormhole'
import Epiphany from './epiphany/Epiphany'
import Universe from '../universe/Universe'

export default class Sequencer {
  constructor (scene, library, parameters, grid, camera, postProcessor, multiplayer, propertySign) {
    this.scene = scene
    this.library = library
    this.parameters = parameters
    this.grid = grid
    this.camera = camera
    this.postProcessor = postProcessor
    this.multiplayer = multiplayer
    this.propertySign = propertySign

    this.wormhole = new Wormhole(this.scene, this.library, this.parameters)
    this.epiphany = new Epiphany(this.scene, this.library, this.parameters, this.camera, this)
  }

  async launchNextSequence (skipped = false) {
    if(window.sequencer.active) return

    this._onLaunchNextSequence()

    if(window.isMetaverse) {
      await this._launchMetaverseNextSequence()
    } else {
      await this._launchStoryNextSequence(skipped)
    }
  }

  async _launchMetaverseNextSequence() {
    this.onEnteringUniverse()

    this.camera.rotation.z = 0
    
    if(!window.isDebugMode) {
      const songName = window.isFirstUniverse ? 'ghosts' : this._getRandomSongName()
      this.library.audio[songName].play()
      this.library.audio[songName].loop(true)
    }

    this.fadeOutById('#whitewall', 1)
    this.fadeOutById('#blackwall', 1)
    await this.showNavigation()

    this._onEndingSequence()
  }

  async _launchStoryNextSequence(skipped) {
    switch (window.storyCurrentUniverse) {
      case 0:
        await this.chapterOneSequence(skipped)
        break

      case 1:
        await this.chapterTwoSequence(skipped)
        break

      case 2:
        await this.chapterThreeSequence(skipped)
        break
      
      case 3:
        await this.chapterFourSequence(skipped)
        break

      case 4:
        await this.epiphanySequence(skipped)
        break

      default:
        await this.borealis()
        break
    }
  }

  _onLaunchNextSequence() {
    window.sequencer.active = true
    this._handleMultiplayerDisplay()
  }

  _onEndingSequence() {
    window.sequencer.active = false
    this._handleMultiplayerDisplay()

    // TODO : fix bug surimpression
    //if(window.currentUniverse != 0)
    //  this.propertySign.addPropertySign()
  }

  _handleMultiplayerDisplay() {
    if(window.isMetaverse) {
      this.multiplayer.showMultiplayer()
    }
  }

  async chapterOneSequence (skipped = false) {
    if (skipped) {
      this.camera.rotation.z = 0

      if(!window.isDebugMode) {
        this.library.audio['ghosts'].play()
        this.library.audio['ghosts'].loop(true)
      }

      this.fadeOutById('#whitewall', 2)
      this.fadeOutById('#blackwall', 2)
      await this.showNavigation()
    } else {
      this.stopAllSounds()
      this.library.audio['transcendent'].play()
      this.library.audio['transcendent'].on('end', () => {
        this.library.audio['ghosts'].play()
        this.library.audio['ghosts'].loop(true)
      })

      await this.asyncWaitFor(2000)
      const introElement = document.getElementById('intro')
      if(introElement) introElement.remove()

      gsap.to(this.camera.rotation, { duration: 40, ease: 'Power0.easeNone', z: 0 })

      this.fadeOutById('#whitewall', 10, 'Power0.easeNone')
      await this.fadeOutById('#blackwall', 10, 'Power0.easeNone')
      
      await this.showThenHideStory(this.parameters.story.chapterone[0])
      await this.showThenHideStory(this.parameters.story.chapterone[1], 0)
      await this.showThenHideStory(this.parameters.story.chapterone[2], 0)
      await this.showThenHideStory(this.parameters.story.chapterone[3], 0)
      await this.showNavigation()
    }

    this._onEndingSequence()
  }

  async chapterTwoSequence (skipped = false) {
    if (skipped) {
      this.camera.rotation.z = 0

      this.stopAllSounds()
      this.library.audio['discovery'].play()
      this.library.audio['discovery'].loop(true)

      this.changeUniverse()
      await this.asyncWaitFor(2000)

      this.fadeOutById('#whitewall', 2)
      this.fadeOutById('#blackwall', 2)

      this.onEnteringUniverse()

      await this.showNavigation()
    } else {
      this.stopAllSounds()
      this.library.audio['discovery'].play()
      this.library.audio['discovery'].loop(true)

      this.changeUniverse()

      await this.asyncWaitFor(2000)

      this.onEnteringUniverse()
      await this.fadeOutById('#whitewall', 10, 'Power0.easeNone')
      await this.showThenHideStory(this.parameters.story.chaptertwo[0])
      await this.showThenHideStory(this.parameters.story.chaptertwo[1], 0)
      await this.showThenHideStory(this.parameters.story.chaptertwo[2], 0)
      await this.showThenHideStory(this.parameters.story.chaptertwo[3], 0)
      await this.showNavigation()
    }
  
    this._onEndingSequence()
  }

  async chapterThreeSequence (skipped = false) {
    if (skipped) {
      this.camera.rotation.z = 0

      this.stopAllSounds()
      this.library.audio['celestial'].play()
      this.library.audio['celestial'].loop(true)

      this.changeUniverse()
      await this.asyncWaitFor(2000)

      this.fadeOutById('#whitewall', 2)
      this.fadeOutById('#blackwall', 2)

      this.onEnteringUniverse()

      await this.showNavigation()
    } else {
      this.stopAllSounds()
      this.library.audio['celestial'].play()
      this.library.audio['celestial'].loop(true)

      this.changeUniverse()

      await this.asyncWaitFor(2000)

      this.onEnteringUniverse()
      this.fadeOutById('#blackwall', 0)
      await this.fadeOutById('#whitewall', 10, 'Power0.easeNone')
      await this.showThenHideStory(this.parameters.story.chapterthree[0])
      await this.showThenHideStory(this.parameters.story.chapterthree[1], 0)
      await this.showThenHideStory(this.parameters.story.chapterthree[2], 0)
      await this.showThenHideStory(this.parameters.story.chapterthree[3], 0)
      await this.showNavigation()
    }

    this._onEndingSequence()
  }

  async chapterFourSequence (skipped = false) {
    if (skipped) {
      this.camera.rotation.z = 0

      this.stopAllSounds()
      this.library.audio['omega'].play()
      this.library.audio['omega'].loop(true)

      this.changeUniverse()
      await this.asyncWaitFor(2000)

      this.fadeOutById('#whitewall', 2)
      this.fadeOutById('#blackwall', 2)

      this.onEnteringUniverse()

      await this.showNavigation()
    } else {
      this.stopAllSounds()
      this.library.audio['omega'].play()
      this.library.audio['omega'].loop(true)

      this.camera.far = 200000
      this.camera.updateProjectionMatrix()

      this.changeUniverse()
      
      await this.asyncWaitFor(2000)

      this.onEnteringUniverse()
      this.fadeOutById('#blackwall', 0)
      await this.fadeOutById('#whitewall', 10, 'Power0.easeNone')
      await this.showThenHideStory(this.parameters.story.chapterfour[0])
      await this.showThenHideStory(this.parameters.story.chapterfour[1], 0)
      await this.showThenHideStory(this.parameters.story.chapterfour[2], 0)
      await this.showThenHideStory(this.parameters.story.chapterfour[3], 0)
      await this.showNavigation()
    }

    this._onEndingSequence()
  }

  async epiphanySequence (skipped = false) {
    window.sequencer.active = true

    if (skipped) {
      this.library.audio['intothenight'].play()
      this.library.audio['intothenight'].loop(true)

      this.scene.background = "#000F34"
      this.camera.far = 60000
      this.camera.updateProjectionMatrix()
      this.resetScene()
      this.postProcessor.updateProcessingRenderer()

      this.epiphany.generate()

      this.fadeOutById('#whitewall', 0)
      this.fadeOutById('#blackwall', 0)
    
      await this.epiphany.animate()
    } else {
      this.stopAllSounds()
      this.library.audio['intothenight'].play()

      this.scene.background = "#000F34"
      this.camera.far = 60000
      this.camera.updateProjectionMatrix()
      this.resetScene()
      this.postProcessor.updateProcessingRenderer()

      this.epiphany.generate()

      await this.asyncWaitFor(2000)
      await this.epiphany.animate()
    }

    window.sequencer.active = false
  }

  async wormholeSequence () {
    if(window.sequencer.active) return

    window.isFirstUniverse = false

    if(window.isMetaverse) {
      await this._metaverseWormholeSequence()
    } else {
      await this._storyWormholeSequence()
    }
  }

  async _storyWormholeSequence () {
    window.sequencer.active = true

    this.stopAllSounds()

    this.fadeOutById('#credits', 0.1)
    this.hideNavigation()

    await this.fadeInById('#blackwall', 0.2)

    this.resetScene()
    this.resetPlayer()

    if(window.epiphany) window.epiphany.dispose()

    this.scene.background = "#000000"
    this.camera.near = 0.01
    this.camera.updateProjectionMatrix()

    this.wormhole.generate()
    this.wormhole.active()

    this.startSoundByTitle('wormhole')
    this.fadeOutById('#blackwall', 0.5)

    window.storyCurrentUniverse++

    window.currentUniverse = new Universe(this.parameters, window.storyCurrentUniverse + 1)
    const generateCurrentUniverse = window.currentUniverse.generate()
    const wormholeAnimate = this.wormhole.animate()

    // parallel awaits
    await generateCurrentUniverse
    await wormholeAnimate

    await this.fadeInById('#whitewall', 1)

    this.camera.near = 100
    this.camera.updateProjectionMatrix()

    this.wormhole.dispose()
    window.wormhole.CameraPositionIndex = 0

    await this.asyncWaitFor(500)

    window.sequencer.active = false
    await this.launchNextSequence()
  }

  async _metaverseWormholeSequence () {
    window.sequencer.active = true

    this.stopAllSounds()
    this.multiplayer.hideMultiplayer()

    // TODO: fix bug surimpression
    //this.propertySign.dispose()

    this.fadeOutById('#credits', 0.1)
    this.hideNavigation()
    await this.fadeInById('#blackwall', 0.2)

    this.resetScene()
    this.resetPlayer()

    this.scene.background = "#000000"
    this.camera.near = 0.01
    this.camera.updateProjectionMatrix()

    this.wormhole.generate()
    this.wormhole.active()

    // tochange back
    this.startSoundByTitle('wormhole')
    this.fadeOutById('#blackwall', 0.5)

    const oldUniverseId = window.currentUniverse.universeModifiers.type.id
    window.currentUniverse = new Universe(this.parameters)

    const generateCurrentUniverse = window.currentUniverse.generateRandom(oldUniverseId)
    const wormholeAnimate = this.wormhole.animate()

    // parallel awaits
    await generateCurrentUniverse
    // tochange back
    await wormholeAnimate
    await this.fadeInById('#whitewall', 1)

    this.changeUniverse()

    this.camera.near = 100
    this.camera.updateProjectionMatrix()

    this.wormhole.dispose()
    window.wormhole.CameraPositionIndex = 0

    await this.asyncWaitFor(500)
    window.sequencer.active = false

    await this.launchNextSequence()
  }

  // you are not supposed to be here, as a matter of fact, you're not
  async borealis () {
    window.sequencer.active = true
    this.fadeOutById('#blackwall', 0)
    this.stopAllSounds()
    this.library.audio['borealis'].play()
    this.library.audio['borealis'].on('end', () => {
      window.storyCurrentUniverse = 0
      window.currentUniverse = new Universe(this.parameters, window.storyCurrentUniverse)
      window.currentUniverse.generate()
      this.changeUniverse()
      window.sequencer.active = false
      this.launchNextSequence()
    })
  }

  async fadeInById (id, duration = 2, ease = 'power2.out') {
    const element = document.querySelector(id)

    element.style.opacity = 0
    element.style.zIndex = 9

    return gsap.to(element.style, {
      duration: duration,
      ease: ease,
      opacity: 1
    }).then(() => true)
  }

  async fadeOutById (id, duration = 2, ease = 'power2.out') {
    const element = document.querySelector(id)

    element.style.opacity = 1

    return gsap.to(element.style, {
      duration: duration,
      ease: ease,
      opacity: 0
    }).then(() => {
      element.style.zIndex = 7
      return true
    })
  }

  stopAllSounds () {
    Object.keys(this.library.audio).forEach(key => this.library.audio[key].stop())
  }

  startSoundByTitle (title) {
    this.library.audio[title].play()
  }

  async showThenHideStory (story, delay=3, type='text') {
    const element = document.querySelector("#story")

    element.style.opacity = 0
    element.style.zIndex = 10

    if (type==='image')
      story = `<img src='${story}' alt='' />`

    element.innerHTML = story

    const chapterOneTimeline = gsap.timeline()
    chapterOneTimeline
      .delay(delay)
      .to(element.style, { duration: 3, opacity: 1 })
      .to(element.style, { duration: 3, opacity: 0 }, 6)

    return chapterOneTimeline.then(() => {
      element.style.zIndex = 7
      element.innerHTML = ''

      return true
    })
  }

  async asyncWaitFor (milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  resetScene () {
    this.grid.disposeClusters(Array.from(this.grid.activeClusters.keys()))
    this.deepResetScene(this.scene)
    this.setLight()
  }

  deepResetScene(obj){
    while(obj.children.length > 0) {
      this.deepResetScene(obj.children[0])
      obj.remove(obj.children[0]);
    }

    if(obj.geometry) obj.geometry.dispose()
  
    if(obj.material){ 
      Object.keys(obj.material).forEach(prop => {
        if(!obj.material[prop])
          return

        if(obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function')
          obj.material[prop].dispose()
      })
      obj.material.dispose()
    }
  }

  setLight () {
    const ambientLight = new THREE.AmbientLight("#FFFFFF", 1)
    const directionalLight = new THREE.DirectionalLight("#FFFFFF", 1)
    directionalLight.position.set(0, 400, 0)
    this.scene.add(ambientLight, directionalLight)
  }

  resetPlayer() {
    this.camera.rotation.set(0, 0, 0)
    this.camera.position.set(0, 0, 0)
    this.camera.lookAt(0, 0, 0)
    this.camera.translateX(0)
    this.camera.translateY(0)
    this.camera.translateZ(0)
    this.camera.updateProjectionMatrix()
  }

  changeUniverse () {
    this.resetScene()
    this.postProcessor.updateProcessingRenderer()
    this.grid.populateNewUniverse()
  }

  onEnteringUniverse() {
    this.camera.rotation.set(0,0,0)
    if(!window.isFirstUniverse) {
      window.controls.velocity.z = -20000
      gsap.timeline().to(window.controls.velocity, { duration: 4, z: -200 }, 0)
    }
  }

  async showNavigation() {
    if (window.isMobileOrTabletFlag) {
      this.fadeInById('#movement-pad', 0.3, 'Power0.easeNone')
      this.fadeInById('#rotation-pad', 0.3, 'Power0.easeNone')
    } else {
      if(window.controls.uiVisible)
        await this.fadeInById('#nav', 0.3, 'Power0.easeNone')
    }
  }

  hideNavigation() {
    if (window.isMobileOrTabletFlag) {
      document.querySelector('#movement-pad').style.zIndex = 7
      document.querySelector('#rotation-pad').style.zIndex = 7
      document.querySelector('#movement-pad').style.opacity = 0
      document.querySelector('#rotation-pad').style.opacity = 0
    } else {
      document.querySelector('#nav').style.zIndex = 7
      document.querySelector('#nav').style.opacity = 0
    }
  }

  _getRandomSongName() {
    const songNames = [
      'ghosts',
      'discovery',
      'celestial',
      'omega'
    ]

    return songNames[THREE.Math.randInt(0, songNames.length - 1)]
  }
}
