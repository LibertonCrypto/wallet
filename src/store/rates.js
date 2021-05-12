import rates from '@utils/rates'

export default {
  namespaced: true,
  state: {
    items: {},
    updatedAt: null
  },

  mutations: {
    update (state, payload) {
      state.updatedAt = new Date()

      Object.assign(state.items, payload)
    }
  },

  actions: {
    async update ({ commit }) {
      commit('update', await rates.updateTonRate())
      commit('update', await rates.updateFiatRates())
    }
  }
}
