import rates from './rates'
import network from './network'
import wallets from './wallets'
import { only } from './helpers'
import accounts from './accounts'
import settings from './settings'
import { createStore } from 'vuex'
import deployments from './deployments'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  key: 'liberton',
  storage: window.localStorage,

  restoreState(key, storage) {
    const data = storage.getItem(key)

    if (!data) {
      return {}
    }

    const parsed = JSON.parse(data)

    // Never pick up default networks from local storage
    parsed.network.items = Object.fromEntries(
      Object.entries(parsed.network.items).filter(
        ([k, n]) => n.isDefault !== true
      )
    )

    return parsed
  },
})

export default createStore({
  modules: {
    rates,
    network,
    wallets,
    accounts,
    settings,
    deployments,
  },
  plugins: [vuexLocal.plugin],
})
