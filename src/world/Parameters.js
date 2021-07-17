import * as dat from 'dat.gui'

// todo : implemet datgui control here
export default class Parameters {
    constructor() {
        this.global = {
            webGlRenderer:{
                powerPreference: "high-performance",
                antialias: false,
                stencil: false,
                depth: false
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
                }
            }
        }
    }
}