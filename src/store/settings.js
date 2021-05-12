export default {
  namespaced: true,

  state: {
    locale: 'en'
  },

  getters: {

  },

  mutations: {
    set (state, payload) {
      Object.assign(state, payload)
    }
  }
}
