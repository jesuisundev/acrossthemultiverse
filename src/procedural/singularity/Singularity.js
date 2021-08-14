import * as THREE from 'three'
import singularityBlackholeVertexShader from '../../shaders/singularity/blackhole/vertex.glsl'
import singularityBlackholeFragmentShader from '../../shaders/singularity/blackhole/fragment.glsl'

export default class Singularity {
  constructor (scene, library, parameters) {
    this.scene = scene
    this.library = library
    this.parameters = parameters

    this.textureSeen = []
    this.giant = null
  }

  generate (blackholeAttributes, position) {
    const currentCoordinateVector = this._getCoordinateVectorByPosition(position)

    const blackholeDiskGeometry = new THREE.RingGeometry(5.45, 20, 32)
    const blackholeDiskMaterial = this._getRandomBlackHoleShaderMaterial()
    const blackholeDiskMesh = new THREE.Mesh(blackholeDiskGeometry, blackholeDiskMaterial)
    blackholeDiskMesh.scale.set(1000, 1000, 1000)
    blackholeDiskMesh.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)

    blackholeDiskMaterial.needsUpdate = true
    blackholeDiskMaterial.key = Math.floor(Date.now() + Math.random())
    blackholeDiskMesh.key = blackholeDiskMaterial.key
    window.materialsToUpdate[blackholeDiskMaterial.key] = blackholeDiskMaterial
    window.meshesToUpdate[blackholeDiskMesh.key] = blackholeDiskMesh

    const blackholeGeometry = new THREE.SphereGeometry(1, 32, 16)
    const blackholeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: false,
      side: THREE.DoubleSide
    })
    const blackholeMesh = new THREE.Mesh(blackholeGeometry, blackholeMaterial)
    blackholeMesh.scale.set(5000, 5000, 3000)
    blackholeMesh.position.set(currentCoordinateVector.x, currentCoordinateVector.y, currentCoordinateVector.z)

    blackholeMesh.key = Math.floor(Date.now() + Math.random())
    window.meshesToUpdate[blackholeMesh.key] = blackholeMesh

    const randomBlackhole = {
      disk: {
        geometry: blackholeDiskGeometry,
        texture: null,
        material: blackholeDiskMaterial,
        mesh: blackholeDiskMesh
      },
      blackhole: {
        geometry: blackholeGeometry,
        texture: null,
        material: blackholeMaterial,
        mesh: blackholeMesh
      }
    }

    this.blackhole = randomBlackhole
  }

  dispose () {
    if (!this.blackhole) {
      console.log('Can\'t dispose empty blackhole')
      return
    }

    delete window.materialsToUpdate[this.blackhole.disk.material.key]

    delete window.meshesToUpdate[this.blackhole.disk.mesh.key]
    delete window.meshesToUpdate[this.blackhole.blackhole.mesh.key]

    this.blackhole.disk.geometry.dispose()
    this.blackhole.blackhole.geometry.dispose()

    this.blackhole.disk.material.dispose()
    this.blackhole.blackhole.material.dispose()

    this.scene.remove(
      this.blackhole.disk.mesh,
      this.blackhole.blackhole.mesh
    )

    this.blackhole = null
  }

  show () {
    if (!this.blackhole) {
      console.log('Can\'t show empty blackhole')
      return
    }

    this.scene.add(
      this.blackhole.disk.mesh,
      this.blackhole.blackhole.mesh
    )
  }

  _getRandomBlackHoleShaderMaterial () {
    return new THREE.ShaderMaterial({
      vertexShader: singularityBlackholeVertexShader,
      fragmentShader: singularityBlackholeFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: this.library.textures.blackhole.disk[0] }
      },
      side: THREE.DoubleSide
    })
  }

  _getCoordinateVectorByPosition (position) {
    const coordinateVector = new THREE.Vector3(0, 0, 0)

    // we dont need to tweak coordinates on the origin cluster
    if (position !== '0,0,0') {
      const arrayCurrentCluster = position.split(',')

      // handling x axis (right and left) clusters population
      const xCurrentCluster = parseInt(arrayCurrentCluster[0])

      if (xCurrentCluster !== 0) {
        coordinateVector.x = (this.parameters.grid.clusterSize) * xCurrentCluster
      }

      // since we're not handling vertical movement at the moment
      // we dont need to handle the y axis

      // handling z axis (forward and backward) clusters population
      const zCurrentCluster = parseInt(arrayCurrentCluster[2])

      if (zCurrentCluster !== 0) {
        coordinateVector.z = (this.parameters.grid.clusterSize) * zCurrentCluster
      }
    }

    return coordinateVector
  }
}
