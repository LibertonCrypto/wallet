import { v4 } from 'uuid'
import { ton } from '@utils/ton'
import { i18n } from '@utils/i18n'
import { toSHA256 } from '@utils/convert'
import { current, getDecrypted, passwordCheck, withIds } from './helpers'

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
    withIds,
    current,
    getDecrypted,
    passwordCheck,

    forAccount (state, getters, rootState) {
      return id => {
        const accountId = id || rootState.accounts.selectedId

        return getters.withIds.filter(w => w.accountId === accountId)
      }
    }
  },

  actions: {
    async create ({ commit, getters, rootState, rootGetters }, { name, password, account }) {
      const accountId = account || rootState.accounts.selectedId

      const index = getters.forAccount(accountId).length
      const xprv = await rootGetters['accounts/getDecrypted']({
        password,
        id: accountId
      })

      const keys = await ton.getKeyPair({
        xprv, index
      })

      const id = v4()

      commit('push', {
        id,
        data: {
          index,
          accountId,
          public: keys.public,
          passwordHash: await toSHA256(password),
          secret: await ton.encrypt({
            password,
            data: keys.secret
          }),
          name: name || i18n.global.t('global.wallet') + ' #' + (index + 1)
        }
      })

      commit('select', id)
    }
  }
}
