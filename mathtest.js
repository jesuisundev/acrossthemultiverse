
// sphere -> black hole
let alpha = Math.random()*(Math.PI)
let theta = Math.random()*(Math.PI*2)
let x = sectorSize * (Math.cos(alpha) * Math.sin(theta)) - (sectorSize / 2)
let y = sectorSize * (Math.sin(alpha) * Math.sin(theta)) - (sectorSize / 2)
let z = sectorSize * (Math.cos(theta)) - (sectorSize / 2)


// filament galaxy -> octa
let alpha = Math.random()*(Math.PI*2)-(Math.random()*Math.PI*2)
let theta = Math.random()*(Math.PI)-(Math.random()*Math.PI*2)
let x = sectorSize * (Math.pow(Math.cos(alpha)*Math.cos(theta), 3)) - (sectorSize / 2)
let y = sectorSize * (Math.pow(Math.sin(alpha)*Math.cos(theta), 3))
let z = sectorSize * (Math.pow(Math.sin(theta), 3)) - (sectorSize / 2)

// cylinder -> warp
let alpha = Math.random()*(Math.PI*2)
let theta = Math.random()*(Math.PI*2)
let x = sectorSize * (Math.cos(alpha)) - (sectorSize / 2)
let y = sectorSize * (Math.sin(alpha)) - (sectorSize / 2)
let z = sectorSize * (-(Math.sin(theta))) - (sectorSize / 2)