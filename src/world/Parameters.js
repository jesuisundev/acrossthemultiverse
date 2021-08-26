import * as POSTPROCESSING from 'postprocessing'

export default class Parameters {
  constructor () {
    this.global = {
      webGlRenderer: {
        powerPreference: 'high-performance',
        antialias: false,
        stencil: false,
        depth: false
      },
      camera: {
        fov: 100,
        near: 300,
        far: 60000,
        defaultRotation: 0.00015,
        defaultForward: 0.5
      },
      clusterRenderTimeOut: 50,
      background: [
        0x000000,
        0x000000,
        0x000000,
        0x000000
      ]
    }

    this.postprocessing = {
      bloomEffect: {
        blendFunction: POSTPROCESSING.BlendFunction.SCREEN,
        kernelSize: POSTPROCESSING.KernelSize.HUGE,
        luminanceThreshold: 0,
        luminanceSmoothing: 0,
        intensity: 4,
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
      velocity: 1500.0,
      speedLimit: {
        up: 5000.0,
        down: -5000.0
      }
    }

    this.grid = {
      clusterSize: 45000 // 65000
    }

    this.story = {
      chapterone: [
        "Chapter One\nTranscendence",
        "You are the pioneer of the human race.",
        "Find a supermassive black hole and go beyond our universe.",
        "Epiphany awaits."
      ],
      chaptertwo: [
        "Chapter Two\nWonder",
        "Physics laws have slightly changed.",
        "Find a supermassive black hole and go to the next universe.",
        "Epiphany awaits."
      ],
      chapterthree: [
        "Chapter Three\nFilaments",
        "Physics laws have heavily changed.",
        "Find a supermassive black hole and go to the next universe.",
        "Epiphany awaits."
      ],
      epiphany: [
        "Epiphany",
        "No one knows how it started.",
        "But we know how it is.",
        "Every universe is created within the blackhole of another.",
        "These baby universes change their physics laws to favor their own survival.",
        "The more they create black holes, the more they create baby universes.",
        "Which will create more black holes to create more baby universes.",
        "Producing reality as we know it.",
        "An infinite multiverse following the perpetual law of evolution.",
        "The eternal loop of everything."
      ]
    }

    this.wormhole = {
      speed: 5000,
      wireframedStarsSpeeder: {
        material: {
          opacity: 0
        }
      },
      auraSpeeder: {
        material: {
          opacity: 0
        }
      },
      nebulaSpeeder: {
        material: {
          opacity: 0
        }
      },
      starsSpeeder: {
        material: {
          opacity: 0
        }
      },
      clusterSpeeder: {
        material: {
          opacity: 0
        }
      }
    }

    this.matters = []

    this.setMattersByChapter()
  }

  setMattersByChapter() {
    this.setMattersChapterOne()
    this.setMattersChapterTwo()
    this.setMattersChapterThree()
    this.setMattersEpiphany()
  }

  setMattersChapterOne() {
    this.matters[0] = {
      starfield: {
        budget: 300000,
        vertices: {
          bright: {
            min: 0.00001,
            max: 0.0001
          },
          pass: {
            min: 0.05,
            max: 0.25
          },
          globularPass: {
            min: 0.1,
            max: 0.15
          }
        },
        material: {
          size: {
            bright: {
              min: 300,
              max: 400
            },
            pass: {
              min: 55,
              max: 65
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
          '#9bb2ff',
          '#9eb5ff',
          '#a3b9ff',
          '#aabfff',
          '#b2c5ff',
          '#bbccff',
          '#c4d2ff',
          '#ccd8ff',
          '#d3ddff',
          '#dae2ff',
          '#dfe5ff',
          '#e4e9ff',
          '#e9ecff',
          '#eeefff',
          '#f3f2ff',
          '#f8f6ff',
          '#fef9ff',
          '#fff9fb',
          '#fff7f5',
          '#fff5ef',
          '#fff3ea',
          '#fff1e5',
          '#ffefe0',
          '#ffeddb',
          '#ffebd6',
          '#ffe9d2',
          '#ffe8ce',
          '#ffe6ca',
          '#ffe5c6',
          '#ffe3c3',
          '#ffe2bf',
          '#ffe0bb',
          '#ffdfb8',
          '#ffddb4',
          '#ffdbb0',
          '#ffdaad',
          '#ffd8a9',
          '#ffd6a5',
          '#ffd5a1',
          '#ffd29c',
          '#ffd096',
          '#ffcc8f',
          '#ffc885',
          '#ffc178',
          '#ffb765',
          '#ffa94b',
          '#ff9523',
          '#ff7b00',
          '#ff5200'
        ],
        globularColors: [
          '#FF8E05',
          '#EF93E6',
          '#FDFFF2',
          '#D7693D',
          '#ffc178',
          '#ffb765',
          '#ffa94b',
          '#ff9523',
          '#ff7b00',
          '#ff5200',
          '#9bb2ff',
          '#9eb5ff',
          '#a3b9ff',
          '#aabfff',
          '#b2c5ff',
          '#bbccff',
          '#c4d2ff'
        ]
      },
      nebula: {
        budget: 300000,
        vertices: {
          bright: {
            min: 0.00002,
            max: 0.0002
          },
          pass: {
            min: 0.10,
            max: 0.20
          },
          cloud: {
            min: 0.10,
            max: 0.20
          },
          emission: {
            tubularSegments: 100,
            radius: 10,
            radiusSegments: 50,
            closed: true
          }
        },
        material: {
          size: {
            cloud: {
              min: 2000,
              max: 2000
            },
            pass: {
              min: 50,
              max: 60
            },
            bright: {
              min: 500,
              max: 600
            }
          },
          opacity: {
            cloud: {
              min: 0.02,
              max: 0.02
            },
            pass: {
              min: 1,
              max: 1
            },
            bright: {
              min: 0.1,
              max: 1
            }
          }
        },
        colors: {
          in: ['#0091ff', '#0011ff', '#000222', '#4b0082', '#8a2be2', '#FF5300', '#489BCF', '#AA1428'],
          out: ['#00FF00', '#0000FF', '#FF0000', '#00FF00', '#DE3FFE', '#1E0500', '#4A61A4', '#000042']
        },
        remnantColors: {
          in: ['#0091ff', '#0011ff', '#000222', '#4b0082', '#8a2be2', '#FF5300', '#489BCF', '#AA1428'],
          out: ['#00FF00', '#0000FF', '#FF0000', '#00FF00', '#DE3FFE', '#1E0500', '#4A61A4', '#000042']
        }
      },
      giant: {
        budget: 300000,
        vertices: {
          bright: {
            min: 0.001,
            max: 0.002
          },
          pass: {
            min: 0.25,
            max: 0.30
          }
        },
        material: {
          size: {
            bright: {
              min: 600,
              max: 800
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
        shader: {
          sun: {
            scale: {
              min: 5000,
              max: 15000
            },
            uBrightnessAmplifier: {
              min: 0.20,
              max: 0.25
            },
            uNoiseIntensity: {
              min: 2.0,
              max: 8.0
            },
            uNoiseSpeed: {
              min: 0.03,
              max: 0.08
            }
          },
          whitedwarf: {
            scale: {
              min: 1000,
              max: 1500
            },
            uBrightnessAmplifier: {
              min: 0.20,
              max: 0.25
            },
            uNoiseIntensity: {
              min: 2.0,
              max: 6.0
            },
            uNoiseSpeed: {
              min: 0.01,
              max: 0.02
            }
          }
        },
        colors: [
          '#9bb2ff',
          '#9eb5ff',
          '#a3b9ff',
          '#aabfff',
          '#b2c5ff',
          '#bbccff',
          '#c4d2ff',
          '#ccd8ff',
          '#d3ddff',
          '#dae2ff',
          '#dfe5ff',
          '#e4e9ff',
          '#e9ecff',
          '#eeefff',
          '#f3f2ff',
          '#f8f6ff',
          '#fef9ff',
          '#fff9fb',
          '#fff7f5',
          '#fff5ef',
          '#fff3ea',
          '#fff1e5',
          '#ffefe0',
          '#ffeddb',
          '#ffebd6',
          '#ffe9d2',
          '#ffe8ce',
          '#ffe6ca',
          '#ffe5c6',
          '#ffe3c3',
          '#ffe2bf',
          '#ffe0bb',
          '#ffdfb8',
          '#ffddb4',
          '#ffdbb0',
          '#ffdaad',
          '#ffd8a9',
          '#ffd6a5',
          '#ffd5a1',
          '#ffd29c',
          '#ffd096',
          '#ffcc8f',
          '#ffc885',
          '#ffc178',
          '#ffb765',
          '#ffa94b',
          '#ff9523',
          '#ff7b00',
          '#ff5200'
        ]
      },
      blackhole: {
      },
      galaxy: {
        budget: 60000,
        spiral: {
          randomnessPower: 2.8,
          randomness: 0.5,
          spinAmplitude: 0.00008,
          branchesAmplitude: 2.4,
          colorInterpolationAmplitude: 0.5,
          spin: {
            min: 3,
            max: 3
          },
          branches: {
            min: 3,
            max: 7
          }
        },
        irregular: {
          randomnessPower: 4,
          randomness: 20,
          spinAmplitude: 0.8,
          branchesAmplitude: 2.4,
          colorInterpolationAmplitude: 0.5,
          spin: {
            min: 3,
            max: 3
          },
          branches: {
            min: 3,
            max: 7
          }
        },
        vertices: {
          bright: {
            min: 0.00001,
            max: 0.0001
          },
          pass: {
            min: 1,
            max: 1
          },
          cloud: {
            min: 1,
            max: 1
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
              max: 150
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
          '#24346c',
          '#5965a4',
          '#b09bc7',
          '#313e58',
          '#f2f4ff',
          '#000210'
        ],
        galaxyColors: {
          in: [
            "#F0491C",
            '#8ab1cf',
            '#b09bc7',
            '#EFCEBD',
            '#ffdf00'
          ],
          out: [
            '#24346c',
            '#0A0068',
            '#000210',
            '#000941',
            '#841B1F'
          ]
        }
      }
    }
  }

  setMattersChapterTwo() {
    this.matters[1] = JSON.parse(JSON.stringify(this.matters[0]))

    this.matters[1].starfield.vertices.bright = { min: 0.001, max: 0.01 }
    this.matters[1].starfield.material.size.pass = { min: 70, max: 80 }
    this.matters[1].starfield.vertices.colors = [
      '#0C8D9F',
      '#F9EF2E',
      '#08F7FE',
      '#09FBD3',
      '#FE53BB',
      '#F5D300',
      '#FFACFC',
      '#F148FB',
      '#FF2281',
      '#FDC7D7',
      '#E8E500',
      '#4deeea',
      '#00FECA',
      '#FFD300',
      '#E847AE',
      '#13CA91',
      '#FF9472',
      '#FFDEF3',
      '#FF61BE',
      '#F85125',
      '#EBF875',
      '#28CF75',
      '#FE6B35',
      '#CE0000',
      '#7FFF00',
      '#E92EFB',
      '#74ee15'
    ]
    this.matters[1].starfield.vertices.globularColors = this.matters[1].starfield.vertices.colors

    this.matters[1].nebula.cloud = { min: 0.20, max: 0.30 }
    this.matters[1].nebula.bright = { min: 0.0002, max: 0.002 }
    this.matters[1].nebula.vertices.emission.radiusSegments = 100
    this.matters[1].nebula.colors.in = [
      '#0C8D9F',
      '#F9EF2E',
      '#08F7FE',
      '#09FBD3',
      '#FE53BB',
      '#F5D300',
      '#FFACFC',
      '#F148FB',
      '#FF2281',
      '#FDC7D7',
      '#E8E500',
      '#00FECA',
      '#FFD300',
      '#4DEEEA'
    ]

    this.matters[1].nebula.colors.out = [
      '#E847AE',
      '#13CA91',
      '#FF9472',
      '#FFDEF3',
      '#FF61BE',
      '#F85125',
      '#EBF875',
      '#28CF75',
      '#FE6B35',
      '#CE0000',
      '#7FFF00',
      '#E92EFB',
      '#74ee15'
    ]

    this.matters[1].nebula.remnantColors.in = this.matters[1].nebula.colors.in
    this.matters[1].nebula.remnantColors.out = this.matters[1].nebula.colors.out
  }

  setMattersChapterThree() {
    this.matters[2] = JSON.parse(JSON.stringify(this.matters[0]))

    this.matters[2].galaxy.budget = 100000
    this.matters[2].galaxy.spiral.randomnessPower = 0.0002
    this.matters[2].galaxy.spiral.branchesAmplitude = 0.00008
    this.matters[2].galaxy.spiral.branches = { min: 300, max: 500 }
    this.matters[2].galaxy.material.size.pass = {
      min: 10,
      max: 20
    }
  }

  setMattersEpiphany() {
    this.matters[3] = JSON.parse(JSON.stringify(this.matters[0]))
  }
}
