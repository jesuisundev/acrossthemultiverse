
// sphere -> black hole
let alpha = Math.random()*(Math.PI)
let theta = Math.random()*(Math.PI*2)
let x = clusterSize * (Math.cos(alpha) * Math.sin(theta)) - (clusterSize / 2)
let y = clusterSize * (Math.sin(alpha) * Math.sin(theta)) - (clusterSize / 2)
let z = clusterSize * (Math.cos(theta)) - (clusterSize / 2)


// filament galaxy -> octa
let alpha = Math.random()*(Math.PI*2)-(Math.random()*Math.PI*2)
let theta = Math.random()*(Math.PI)-(Math.random()*Math.PI*2)
let x = clusterSize * (Math.pow(Math.cos(alpha)*Math.cos(theta), 3)) - (clusterSize / 2)
let y = clusterSize * (Math.pow(Math.sin(alpha)*Math.cos(theta), 3))
let z = clusterSize * (Math.pow(Math.sin(theta), 3)) - (clusterSize / 2)

// cylinder -> warp
let alpha = Math.random()*(Math.PI*2)
let theta = Math.random()*(Math.PI*2)
let x = clusterSize * (Math.cos(alpha)) - (clusterSize / 2)
let y = clusterSize * (Math.sin(alpha)) - (clusterSize / 2)
let z = clusterSize * (-(Math.sin(theta))) - (clusterSize / 2)

// interesting effect for wrap hole
// screen lines using camera trickery
const camera = new THREE.PerspectiveCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    parameters.global.camera.near,
    parameters.global.camera.far
)
