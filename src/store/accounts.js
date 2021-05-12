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
    }
  },

  getters: {
    count: state => state.ids.length,
    current: state => state.items[state.selectedId],

    getPrivateKey: state => async ({ id, password }) => {
      const account = state.items[id]

      const result = await ton.decrypt({
        password,
        ...account.xprv
      })

      if (!ton.isHex(result.slice(4))) {
        throw new WrongPasswordException()
      }

      return result
    }
  },

  actions: {
    async create ({ commit, getters, dispatch }, { xprv, name, password }) {
      const id = v4()

      commit('push', {
        id,
        data: {
          name: name || i18n.global.t('global.account') + ' #' + (getters.count + 1),
          xprv: await ton.encrypt({
            password,
            data: xprv
          })
        }
      })

      dispatch('wallets/create', { accountId: id, xprv, password }, { root: true })
    }
  }
}
