import rates from './rates'
import network from './network'
import wallets from './wallets'
import accounts from './accounts'
import settings from './settings'
import deployments from './deployments'

import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  key: 'liberton',
  storage: window.localStorage
})

export default createStore({
  modules: {
    rates,
    network,
    wallets,
    accounts,
    settings,
    deployments
  },
  plugins: [
    vuexLocal.plugin
  ]
})
