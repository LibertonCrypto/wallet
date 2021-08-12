import { v4 } from 'uuid'
import { ton } from '@/utils/ton'
import { withIds, only } from './helpers'
import { getContractByHash, getContractBySlug } from '@/utils/contracts'

export default {
  namespaced: true,
  state: {
    ids: [],
    items: {},
  },

  mutations: {
    update(state, { id, balance }) {
      for (const [uid, deployment] of Object.entries(state.items)) {
        if (deployment.address === id) {
          state.items[uid].balance = balance
        }
      }
    },

    upsert(state, payload) {
      const list = withIds(state)
      const exists = list.find(
        (d) =>
          d.address === payload.address && d.networkId === payload.networkId
      )

      if (exists) {
        return Object.assign(state.items[exists.id], payload)
      }

      const id = v4()

      state.ids.push(id)
      state.items[id] = payload
    },
  },

  getters: {
    withIds,

    addressList(state) {
      return Object.values(state.items).map((i) => i.address)
    },

    forWallet: (state, getters, rootState) => (walletId) => {
      const networkId = rootState.network.selectedId

      return getters.withIds.find(
        (d) => d.walletId === walletId && d.networkId === networkId
      )
    },
  },

  actions: {
    async fetch({ commit, state }, id) {
      const deployment = state.items[id]
      const [data] = await ton.fetchAccounts([deployment.address])

      let insertContract = {}

      if (deployment.contract === 'unknown') {
        const foundContract = getContractByHash(data.code_hash)

        if (foundContract) {
          insertContract = {
            contract: foundContract.slug,
          }
        }
      }

      commit('upsert', {
        address: deployment.address,
        networkId: deployment.networkId,

        ...insertContract,
        ...only(data, ['balance', 'boc']),
      })
    },
  },
}
