import * as THREE from 'three'

export default class Player {
  constructor (camera, scene, library, parameters) {
    this.camera = camera
    this.scene = scene
    this.library = library
    this.parameters = parameters

    this.initialize()
  }

  initialize() {
    this.geometry = new THREE.BoxGeometry(500, 500, 500)
    this.material = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: false})
    
    this.character = new THREE.Mesh(this.geometry, this.material)
    this.character.frustumCulled = false
    this.character.position.set(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z - 2000
    )
  }
}
