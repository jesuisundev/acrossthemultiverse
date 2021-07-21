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
                near: 10,
                far: 2000,
                defaultRotation: 0.00015,
                defaultForward: 0.05
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
                focalLength: 4,
                bokehScale: 4,
                height: 480
            }
        }

        this.controls = {
            velocity: 600.0,
            speedLimit: {
                up: 600.0,
                down: -600.0
            }
        }

        this.grid = {
            clusterSize: 4500
        }

        this.matters = {
            starfield: {
                budget: 60000,
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
                        min: 6,
                        max: 10
                    },
                    opacity: {
                        min: 1,
                        max: 1
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
            }
        }
    }
}