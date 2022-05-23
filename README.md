# Lego WeDo 2.0 SDK

![npm](https://img.shields.io/npm/v/wedo2-sdk)

**Important note**: this library is under active development

Mono-repository for SDK for Lego WeDo 2.0 with friendly API written in Typescript supports multiply BLE backends.

## Packages
| Package | npm | sources |
| - | - | - |
| wedo2-sdk | [wedo2-sdk](https://npmjs.com/wedo2-sdk/) | [wedo2-sdk](https://github.com/nerlihmax/wedo2-sdk/tree/master/packages/wedo2-sdk/) |   
| @wedo2-sdk/backend-noble | [@wedo2-sdk/backend-noble](https://npmjs.com/@wedo2-sdk/backend-noble/) | [backend-noble](https://github.com/nerlihmax/wedo2-sdk/tree/master/packages/backend-noble/) |

## Features

- [x] Connecting to Hub
- [x] Hub's I/O ports attachment hooks
- [x] Receiving values from sensors
  - [x] Tilt sensor
    - [x] Tilt mode
    - [ ] Angle mode
  - [x] Distance sensor
    - [x] Distance mode
    - [ ] Count mode
- [x] Controlling LED
  - [x] Discrete mode
  - [ ] Absolute mode
- [x] Controlling motor
- [ ] Controlling buzzer

## Usage

_in delevopment_
