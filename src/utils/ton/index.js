import { TonWrapper } from './wrapper'
import { TonClient } from '@tonclient/core'
import { libWeb } from '@tonclient/lib-web'

TonClient.useBinaryLibrary(libWeb)

export const ton = new TonWrapper()

export const plugin = {
  install(app, options) {
    app.provide('ton', ton)
  },
}

export default { ton, plugin }
