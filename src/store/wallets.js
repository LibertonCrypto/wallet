import { v4 } from 'uuid'
import { ton } from '@utils/ton'
import { i18n } from '@utils/i18n'
import WrongPasswordException from '../utils/exceptions/WrongPasswordException'

export default {
  namespaced: true,

  state: {
    ids: [],
    items: {},
    selectedId: null
  },

  mutations: {
    push (state, { id, data }) {
      state.ids.push(id)
      state.items[id] = data
    },

    select (state, payload) {
      state.selectedId = payload
    },

    resetSelect (state) {
      state.selectedId = null
    }
  },

  getters: {
    selected: state => id => state.items[id],
    current: state => ({ id: state.selectedId, ...state.items[state.selectedId] }),

    withIds (state) {
      return Object.entries(state.items)
        .map(([id, data]) => ({ id, ...data }))
    },

    forAccount (state, getters, rootState) {
      return id => {
        const accountId = id || rootState.accounts.selectedId

        return getters.withIds.filter(w => w.accountId === accountId)
      }
    },

    getPrivateKey: state => async ({ id, password }) => {
      const wallet = state.items[id]

      const result = await ton.decrypt({
        password,
        ...wallet.secret
      })

      if (!ton.isHex(result)) {
        throw new WrongPasswordException()
      }

      return result
    }
  },

  actions: {
    async create ({ commit, getters, rootState, rootGetters }, { name, password }) {
      const accountId = rootState.accounts.selectedId
      const index = getters.forAccount(accountId).length

      const xprv = await rootGetters['accounts/getPrivateKey']({
        password,
        id: accountId
      })

      const keys = await ton.getKeyPair({
        xprv, index
      })

      commit('push', {
        id: v4(),
        data: {
          index,
          accountId,
          public: keys.public,
          secret: await ton.encrypt({
            password,
            data: keys.secret
          }),
          name: name || i18n.global.t('global.wallet') + ' #' + (index + 1)
        }
      })
    },

    async update ({ getters, rootState }, { network = null, account = null, id }) {
      const wallet = getters.getWallet({
        id,
        account: account || getters.current.id
      })

      const currentNetwork = rootState.settings.network

      if (!wallet.networks[currentNetwork]) {
        wallet.networks[currentNetwork] = {}
      }

      Object.assign(wallet.networks[currentNetwork], await ton.accountShort(wallet.data.public))
    }
  }
}
