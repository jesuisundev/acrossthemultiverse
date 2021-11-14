import * as THREE from 'three'
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
      clusterRenderTimeOut: 50
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
      velocity: 2000.0,
      speedLimit: {
        up: 6000.0,
        down: -6000.0
      }
    }

    this.grid = {
      clusterSize: 45000
    }

    this.story = {
      chapterone: [
        "TRANSCENDENCE<br /><span class='chapter'>chapter 1<br/><strong>- The Known Universe -</strong></span>",
        "You are the pioneer of the human race",
        "Find a supermassive black hole and go beyond our universe",
        "Epiphany awaits"
      ],
      chaptertwo: [
        "WONDER<br /><span class='chapter'>chapter 2<br/><strong>- Epsilon Aristaeus -</strong></span>",
        "Physics laws have slightly changed",
        "Find a supermassive black hole and go to the next universe",
        "Epiphany awaits"
      ],
      chapterthree: [
        "FILAMENTS<br /><span class='chapter'>chapter 3<br/><strong>- Ursa Borysthenis -</strong></span>",
        "Physics laws have greatly changed",
        "Find a supermassive black hole and go to the next universe",
        "Epiphany awaits"
      ],
      chapterfour: [
        "FRONTIERS<br /><span class='chapter'>chapter 4<br/><strong>- Unknown Universe -</strong></span>",
        "Physics laws have heavily changed",
        "You are close to the origin",
        "Epiphany awaits"
      ],
      epiphany: [
        "EPIPHANY",
        "No one knows how it started",
        "But we know how it is",
        "Every universe is created within the blackhole of another",
        "These baby universes change their physics laws to favor their own survival",
        "The more they create black holes, the more they create baby universes",
        "Which will create more black holes to create more baby universes",
        "Producing reality as we know it",
        "An infinite multiverse following the perpetual law of evolution",
        "The eternal loop of everything"
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

    this.defaultMatters = {
      global: {
        clearColor: '#000000',
        fogColor: '#000000',
        bloomIntensity: 2
      },
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
          },
          transparent: false,
          blending: THREE.AdditiveBlending,
          defaultType: 'pass'
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
      spaceship: {
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
          },
          gargantua: {
            tubularSegments: 1000,
            radius: 5,
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
          },
          transparent: true,
          blending: THREE.AdditiveBlending,
        },
        colors: {
          in: ['#0091ff', '#0011ff', '#000222', '#4b0082', '#8a2be2', '#FF5300', '#489BCF', '#AA1428'],
          out: ['#00FF00', '#0000FF', '#FF0000', '#00FF00', '#DE3FFE', '#1E0500', '#4A61A4', '#000042']
        },
        remnantColors: {
          in: ['#0091ff', '#0011ff', '#000222', '#4b0082', '#8a2be2', '#FF5300', '#489BCF', '#AA1428'],
          out: ['#00FF00', '#0000FF', '#FF0000', '#00FF00', '#DE3FFE', '#1E0500', '#4A61A4', '#000042']
        },
        geometry: {
          emission: {
            randomness: 4,
            radius: 5
          }
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
            },
            uColorAmplifier: {
              primary: 1.0,
              secondary: 2.0,
              tertiary: 3.0
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
          },
          star: {
            scale: {
              min: 500,
              max: 1000
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
            },
            colors: [
                [
                    '#000000', // red
                    '#ff0000',
                    '#ffd236',
                    '#ffe68f',
                ],
                [
                    '#000000', // blue
                    '#0072ff',
                    '#00c7ff',
                    '#90f6ff',
                ]
              ]
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
              min: 0.0001,
              max: 0.0002
            },
            sombrero: {
              min: 0.01,
              max: 0.01
            }
          },
          transparent: false,
          blending: THREE.AdditiveBlending,
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
      },
      strangerthings: {
        cyclic: {
          budget: 100000,
          spiral: {
            randomnessPower: 2.8,
            randomness: 0.5,
            spinAmplitude: 0.00008,
            branchesAmplitude: 2.4,
            colorInterpolationAmplitude: 0.5
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
                min: 200,
                max: 200
              }
            },
            opacity: {
              bright: {
                min: 1,
                max: 1
              },
              pass: {
                min: 1,
                max: 2
              }
            },
            transparent: false,
            blending: THREE.AdditiveBlending,
          },
          colors: {
            in: [
              '#ffb765',
              '#ffa94b',
              '#ff9523',
              '#ff7b00',
              '#ff5200'
            ],
            out: [
              '#ffb765',
              '#ffa94b',
              '#ff9523',
              '#ff7b00',
              '#ff5200'
            ]
          }
        },
        spear: {
          budget: 500000,
          spiral: {
            randomnessPower: 2.8,
            randomness: 0.5,
            spinAmplitude: 0.00008,
            branchesAmplitude: 2.4,
            colorInterpolationAmplitude: 0.5
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
                min: 300,
                max: 300
              }
            },
            opacity: {
              bright: {
                min: 1,
                max: 1
              },
              pass: {
                min: 1,
                max: 2
              }
            },
            transparent: false,
            blending: THREE.AdditiveBlending,
          },
          colors: {
            in: [
              '#ffb765',
              '#ffa94b',
              '#ff9523',
              '#ff7b00',
              '#ff5200'
            ],
            out: [
              '#ffb765',
              '#ffa94b',
              '#ff9523',
              '#ff7b00',
              '#ff5200'
            ]
          }
        }
      }
    }

    this.defaultWorkersDistribution = [
      {
        chances: 20,
        type: 'Starfield',
        subtype: 'Open',
      },
      {
        chances: 13,
        type: 'Nebula',
        subtype: 'Emission'
      },
      {
        chances: 12,
        type: 'Galaxy',
        subtype: 'Irregular'
      },
      {
        chances: 11,
        type: 'Starfield',
        subtype: 'Globular'
      },
      {
        chances: 10,
        type: 'Galaxy',
        subtype: 'Spiral'
      },
      {
        chances: 9,
        type: 'Galaxy',
        subtype: 'Sombrero'
      },
      {
        chances: 8,
        type: 'Nebula',
        subtype: 'Remnant'
      },
      {
        chances: 4,
        type: 'Singularity',
        subtype: 'Blackhole'
      },
      {
        chances: 3,
        type: 'Giant',
        subtype: 'Star'
      },
      {
        chances: 2,
        type: 'Giant',
        subtype: 'Sun'
      },
      {
        chances: 1.5,
        type: 'Spaceship',
        subtype: 'Normandy'
      },
      {
        chances: 1,
        type: 'Giant',
        subtype: 'WhiteDwarf'
      },
      {
        chances: 0.5,
        type: 'Spaceship',
        subtype: 'Station'
      }
    ]

    this.universeProperties = {
      type: {
        stable : {
          id: 'stable',
          displayName: 'Stable',
          probability: 40,
        },
        bloom : {
          id: 'bloom',
          displayName: 'Bloom',
          probability: 25,
        },
        filaments : {
          id: 'filaments',
          displayName: 'Filaments',
          probability: 15,
        },
        ethereum : {
          id: 'ethereum',
          displayName: 'Ethereum',
          probability: 10,
        },
        whirlpool : {
          id: 'whirlpool',
          displayName: 'whirlpool',
          probability: 5,
        },
        quantum : {
          id: 'quantum',
          displayName: 'Quantum',
          probability: 4
        },
        amethyst : {
          id: 'amethyst',
          displayName: 'Amethyst',
          probability: 3,
        },
        eternal : {
          id: 'eternal',
          displayName: 'Eternal',
          probability: 2
        },
        epiphany : {
          id: 'epiphany',
          displayName: 'Epiphany',
          probability: 0
        }
      },
      age: {
        newBorn: {
          id: 'newBorn',
          displayName: 'New Born | ~1B years',
          probability: 1,
        },
        infant: {
          id: 'infant',
          displayName: 'Infant | ~10B years',
          probability: 5,
        },
        toddler: {
          id: 'toddler',
          displayName: 'Toddler | ~100B years',
          probability: 25,
        },
        child: {
          id: 'child',
          displayName: 'Child | ~1T years',
          probability: 50,
        },
        teenager: {
          id: 'teenager',
          displayName: 'Teenager | ~10T years',
          probability: 15,
        },
        adult: {
          id: 'adult',
          displayName: 'Adult | ~100T years',
          probability: 5,
        },
        elder: {
          id: 'elder',
          displayName: 'Elder | ~1E years',
          probability: 1,
        }
      },
      diversity: {
        low: {
          id: 'low',
          displayName: 'Low',
          probability: 40,
        },
        medium: {
          id: 'medium',
          displayName: 'Medium',
          probability: 25,
        },
        high: {
          id: 'high',
          displayName: 'High',
          probability: 15,
        },
        veryHigh: {
          id: 'veryHigh',
          displayName: 'Very High',
          probability: 10,
        },
        extreme: {
          id: 'extreme',
          displayName: 'Extreme',
          probability: 5,
        },
        superExtreme: {
          id: 'superExtreme',
          displayName: 'Super Extreme',
          probability: 1,
        }
      },
      singularity: {
        blackHole: {
          id: 'blackHole',
          displayName: 'Black Hole',
          probability: 99
        },
        blazar: {
          id: 'blazar',
          displayName: 'Blazar',
          probability: 1
        }
      },
      dominantRace: {
        human: {
          id: 'human',
          displayName: 'Human',
          probability: 40,
        },
        protean: {
          id: 'protean',
          displayName: 'Protean',
          probability: 25,
        },
        asari: {
          id: 'asari',
          displayName: 'Asari',
          probability: 15,
        },
        korath: {
          id: 'korath',
          displayName: 'Korath',
          probability: 10,
        },
        kroot: {
          id: 'kroot',
          displayName: 'Kroot',
          probability: 5,
        },
        Turians: {
          id: 'Turians',
          displayName: 'Turians',
          probability: 1,
        },
        ape: {
          id: 'ape',
          displayName: 'Ape',
          probability: 1,
        }
      }
    }
  }
}
