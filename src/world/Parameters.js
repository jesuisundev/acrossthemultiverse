import * as POSTPROCESSING from "postprocessing"

export default class Parameters {
    constructor() {
        this.global = {
            webGlRenderer:{
                powerPreference: "high-performance",
                logarithmicDepthBuffer: true,
                antialias: false,
                stencil: false
            },
            camera : {
                fov: 100,
                near: 100,
                far: 200000,
                defaultRotation: 0.00015,
                defaultForward: 0.5
            },
            clusterRenderTimeOut: 50
        }

        this.postprocessing = {
            bloomEffect: {
                blendFunction: POSTPROCESSING.BlendFunction.SCREEN,
                kernelSize: POSTPROCESSING.KernelSize.HUGE,
                luminanceThreshold: 0,
                luminanceSmoothing: 0,
                intensity: 2,
                scale: 1,
                height: 1080,
                opacity: 1
            },
            depthOfFieldEffect: {
                focusDistance: 0.0,
                focalLength: 5,
                bokehScale: 4,
                height: 480
            },
            brightnessContrastEffect: {
                blendFunction: POSTPROCESSING.BlendFunction.OVERLAY,
                brightness: 1,
                constrast: 1,
                opacity: 1
            }
        }

        this.controls = {
            velocity: 800.0,
            speedLimit: {
                up: 4000.0,
                down: -4000.0
            }
        }

        this.grid = {
            clusterSize: 45000
        }

        this.matters = {
            starfield: {
                budget: 300000,
                vertices: {
                    bright: {
                        min: 0.00001,
                        max: 0.0001
                    },
                    pass: {
                        min: 0.10,
                        max: 0.20
                    }
                },
                material: {
                    size: {
                        bright: {
                            min: 300,
                            max: 400
                        },
                        pass: {
                            min: 50,
                            max: 60
                        }
                    },
                    opacity: {
                        bright: {
                            min: 1,
                            max: 1
                        },
                        pass: {
                            min: 1,
                            max: 1
                        }
                    }
                },
                colors: [
                    "#9bb2ff",
                    "#9eb5ff",
                    "#a3b9ff",
                    "#aabfff",
                    "#b2c5ff",
                    "#bbccff",
                    "#c4d2ff",
                    "#ccd8ff",
                    "#d3ddff",
                    "#dae2ff",
                    "#dfe5ff",
                    "#e4e9ff",
                    "#e9ecff",
                    "#eeefff",
                    "#f3f2ff",
                    "#f8f6ff",
                    "#fef9ff",
                    "#fff9fb",
                    "#fff7f5",
                    "#fff5ef",
                    "#fff3ea",
                    "#fff1e5",
                    "#ffefe0",
                    "#ffeddb",
                    "#ffebd6",
                    "#ffe9d2",
                    "#ffe8ce",
                    "#ffe6ca",
                    "#ffe5c6",
                    "#ffe3c3",
                    "#ffe2bf",
                    "#ffe0bb",
                    "#ffdfb8",
                    "#ffddb4",
                    "#ffdbb0",
                    "#ffdaad",
                    "#ffd8a9",
                    "#ffd6a5",
                    "#ffd5a1",
                    "#ffd29c",
                    "#ffd096",
                    "#ffcc8f",
                    "#ffc885",
                    "#ffc178",
                    "#ffb765",
                    "#ffa94b",
                    "#ff9523",
                    "#ff7b00",
                    "#ff5200"
                ]
            },
            nebula: {
                budget: 300000,
                vertices: {
                    bright: {
                        min: 0.00001,
                        max: 0.00001
                    },
                    pass: {
                        min: 0.10,
                        max: 0.20
                    },
                    emission: {
                        tubularSegments: 200,
                        radius: 1,
                        radiusSegments: 50,
                        closed: true
                    }
                },
                material: {
                    size: {
                        cloud: {
                            min: 2000,
                            max: 3000
                        },
                        pass: {
                            min: 50,
                            max: 60
                        }
                    },
                    opacity: {
                        cloud: {
                            min: 0.1,
                            max: 0.2
                        },
                        pass: {
                            min: 1,
                            max: 1
                        }
                    }
                },
                colors: [
                    "#CB4C61",
                    "#F89ACC",
                    "#225074",
                    "#6F2408",
                    "#00626F",
                    "#150A12",
                    "#FEFBFF",
                    "#7D7F42",
                    "#B3DAFE",
                    "#BF4215",
                    "#57ECF9",
                    "#60FA04"
                ]
            }
        }
    }
}