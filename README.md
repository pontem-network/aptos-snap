# Aptosnap
![](https://github.com/pontem-network/aptos-snap/workflows/ci/badge.svg)
![](https://img.shields.io/badge/yarn-%3E%3D1.17.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D14.x-orange.svg?style=flat-square)
![Discord](https://img.shields.io/discord/608204864593461248?color=blue&label=Discord&logo=discord)

Metamask Snap to enable Metamask users interaction with Aptos dapps based on [Filesnap repository](https://github.com/Chainsafe/filsnap).

### Testing Aptosnap

#### Metamask

First, build and install beta release of Metamask extension: 

- checkout to [this branch](https://github.com/MetaMask/metamask-extension/tree/snaps-stable-nov-21) (chrome recommended)
- build metamask using `yarn start --build-type flask` or `yarn dist`
- go to [chrome://extensions/](chrome://extensions/)
- enable "Developer mode"
- click "Load unpacked" and point to chrome directory

#### Demo DAPP

##### Running Aptosnap demo locally

Start our demo locally by running:

- `yarn install`
- `yarn run demo`

## License

This project is dual-licensed under Apache 2.0 and MIT terms:
- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
