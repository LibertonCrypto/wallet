# Liberton
Liberton wallet gives you ability to interact with FreeTON blockchain effortlessly and safe.

## Browser extension contest
[Google Store](https://chrome.google.com/webstore/detail/gdkembdemaofafmhokloebamoaggiddl) (moderation)

[Submission backlink](https://gov.freeton.org/submission?proposalAddress=0%3Aeb0476d5b03c64009e3782a79bcc431334abf54480cf9d36834743445d534a86&submissionId=16)

## Installation
1) Download latest .crx file from [Releases](https://github.com/LibertonCrypto/wallet/releases) page.
2) Drag n drop it to your browser's extensions page. (e.g. chrome://extensions)

## Building manually
You can bundle this wallet by yourself if you don't want to rely on 3rd parties.

```shell
git clone git@github.com:LibertonCrypto/wallet.git liberton # Clone source code
cd liberton # Go to new dir
yarn install # Install required dependencies
yarn build # Bundle all files together
```
After bundling everything up, go to Extensions page of your browser,
enable Developer mode, press Load unpacked button (or similar) and choose `{your_path}/liberton/dist` folder.
