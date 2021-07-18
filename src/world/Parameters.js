import * as dat from 'dat.gui'

export default class Parameters {
    constructor() {
        this.global = {
            webGlRenderer:{
                powerPreference: "high-performance",
                antialias: true,
                stencil: false
            },
            camera : {
                fov: 100,
                near: 10,
                far: 1500,
                defaultRotation: 0.00015,
                defaultForward: 0.05
            },
            sectorRenderTimeOut: 200
        }

        this.postprocessing = {
            bloomEffect: {
                opacity: 4
            },
            depthOfFieldEffect: {
                focusDistance: 0.0,
                focalLength: 4,
                bokehScale: 4,
                height: 480
            }
        }

        this.controls = {
            velocity: 400.0,
            speedLimit: {
                up: 400.0,
                down: -400.0
            }
        }

        this.grid = {
            sectorSize: 3000
        }

        this.matters = {
            starfield: {
                budget: 60000,
                material: {
                    size: {
                        min: 4,
                        max: 8
                    },
                    opacity: {
                        min: 0.5,
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
                    "#eeefff", // artifically adding more basic white star
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
                    "#eeefff",
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