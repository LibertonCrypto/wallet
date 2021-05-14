import { v4 } from 'uuid'
import { ton } from '@utils/ton'
import { i18n } from '@utils/i18n'
import { toSHA256 } from '@utils/convert'
import { getDecrypted, passwordCheck } from './helpers'

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
    }
  },

  getters: {
    getDecrypted,
    passwordCheck,
    count: state => state.ids.length,
    current: state => state.items[state.selectedId]
  },

  actions: {
    async create ({ commit, getters, dispatch }, { xprv, phrase, name, password }) {
      const id = v4()

      commit('push', {
        id,
        data: {
          phraseHash: await toSHA256(phrase),
          passwordHash: await toSHA256(password),
          name: name || i18n.global.t('global.account') + ' #' + (getters.count + 1),
          xprv: await ton.encrypt({
            password,
            data: xprv
          }),
          phrase: await ton.encrypt({
            password,
            data: phrase
          })
        }
      })

      commit('select', id)

      await dispatch('wallets/create', {
        password,
        account: id
      }, { root: true })
    }
  }
}
