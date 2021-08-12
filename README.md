# Liberton Wallet
Liberton is free and safe non-custodial Free TON wallet. Supports Firefox, Google Chrome, and Chromium-based browsers. We recommend using the latest available browser version.

## Packed version
- [Website](https://wallet.liberton.org)
- [Google Store](https://chrome.google.com/webstore/detail/gdkembdemaofafmhokloebamoaggiddl)

## Building locally
You can build this wallet from the source code by yourself if you don't want to rely on 3rd parties.
- Install [Node.js](https://nodejs.org) version 14
- Install dependencies: `npm i` (or `yarn install` optionally)
- Build the project with `npm run build` (or `yarn build`).
- Go to Extensions page of your browser,
  enable Developer mode, press Load unpacked button (or similar) and choose `./dist` folder.

## Installation for Chromium-based browsers
1) Download latest .crx file from [Releases](https://github.com/LibertonCrypto/wallet/releases) page.
2) Drag and drop it to your browser's extensions page. (e.g. chrome://extensions)
